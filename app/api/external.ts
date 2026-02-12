// AI Generated to create original API calls and corresponding types. Tweaked by hand to be more clear

const BASE_URL = 'https://frontend-takehome.fly.dev'

// Shared pagination
interface PaginatedResponse {
  total: number
  page: number
  limit: number
  offset: number
}

// Conversations
interface GetConversationsParams {
  page?: number
  limit?: number
  'filter[user_id]'?: string
}

export interface GetConversationsResponse extends PaginatedResponse {
  conversations: Conversation[]
}

export interface Conversation {
  id: string
  title: string
  user_id: string
  created: string
  updated: string
}

// Prompts & LLM responses

export interface LlmResponseOutput {
  type: string
  id: string
  status: string
  role: string
  content: Content[]
}

export interface Content {
  type: string
  text: string
  annotations: any[]
}
export interface LlmResponse {
  id: string
  conversation_id: string
  prompt_id: string
  completed_at: string
  model: string
  risk_score: number
  action: 'none' | 'blocked'
  policy_id: string
  output: string | null | LlmResponseOutput[] // JSON string that gets transformed into an object
  created: string
  updated: string
}

export interface Prompt {
  id: string
  conversation_id: string
  text: string
  risk_score: number
  action: 'none' | 'blocked'
  policy_id: string
  created: string
  updated: string
  llm_responses?: LlmResponse[]
}

interface GetPromptsParams {
  page?: number
  limit?: number
  'filter[conversation_id]'?: string
  'filter[policy_id]'?: string
  include?: 'llm_responses'
}

interface GetPromptsResponse extends PaginatedResponse {
  prompts: Prompt[]
}

// Users
export interface User {
  id: string
  name: string
  email: string
  vip: 0 | 1
  created: string
  updated: string
}

interface GetUsersParams {
  page?: number
  limit?: number
  'filter[vip]'?: 0 | 1
}

interface GetUsersResponse extends PaginatedResponse {
  users: User[]
}

// Policies
export interface Policy {
  id: string
  policy_name: string
  policy_version: number
  created: string
  updated: string
}

interface GetPoliciesParams {
  page?: number
  limit?: number
}

interface GetPoliciesResponse extends PaginatedResponse {
  policies: Policy[]
}

function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) search.set(k, String(v))
  }
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const externalApi = {
  getConversations: async ({
    page = 1,
    limit = 100,
    'filter[user_id]': userId,
  }: GetConversationsParams = {}): Promise<GetConversationsResponse> => {
    const params: Record<string, string | number | undefined> = { page, limit }
    // TODO: This is not filtering as expected or I'm doing something wrong
    if (userId) params['filter[user_id]'] = userId
    const res = await fetch(
      `${BASE_URL}/api/conversations${buildQuery(params)}`,
    )
    const data: GetConversationsResponse = await res.json()
    return data
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const res = await fetch(`${BASE_URL}/api/conversations/${id}`)
    const data: Conversation = await res.json()
    return data
  },

  getPrompts: async ({
    page = 1,
    limit = 100,
    'filter[conversation_id]': conversationId,
    'filter[policy_id]': policyId,
    include,
  }: GetPromptsParams = {}): Promise<GetPromptsResponse> => {
    const params: Record<string, string | number | undefined> = { page, limit }
    if (conversationId) params['filter[conversation_id]'] = conversationId
    if (policyId) params['filter[policy_id]'] = policyId
    if (include) params.include = include
    const res = await fetch(`${BASE_URL}/api/prompts${buildQuery(params)}`)
    const data: GetPromptsResponse = await res.json()
    if (include === 'llm_responses') {
      for (const p of data.prompts) {
        if (p.llm_responses) {
          p.llm_responses = p.llm_responses.map((lr) => {
            let output = lr.output
            if (typeof output === 'string' && output) {
              try {
                output = JSON.parse(output)
              } catch {
                /* keep string */
              }
            }
            return { ...lr, output }
          })
        }
      }
    }
    return data
  },

  getPrompt: async (
    id: string,
    options?: { include?: 'llm_responses' },
  ): Promise<Prompt> => {
    const params: Record<string, string | undefined> = {}
    if (options?.include) params.include = options.include
    const res = await fetch(
      `${BASE_URL}/api/prompts/${id}${buildQuery(params)}`,
    )
    const data: Prompt = await res.json()
    if (options?.include === 'llm_responses' && data.llm_responses) {
      data.llm_responses = data.llm_responses.map((llm_response) => {
        const raw = llm_response.output
        const output =
          typeof raw === 'string' && raw
            ? (() => {
                try {
                  return JSON.parse(raw)
                } catch {
                  return raw
                }
              })()
            : raw
        return { ...llm_response, output }
      })
    }
    return data
  },

  getRiskyPrompts: async () => {
    const pageSize = 100
    const { total } = await externalApi.getPrompts({
      page: 1,
      limit: 1,
    })
    const totalPages = Math.ceil(total / pageSize) || 1
    const pagePromises = Array.from({ length: totalPages }, (_, i) =>
      externalApi.getPrompts({
        page: i + 1,
        limit: pageSize,
        include: 'llm_responses',
      }),
    )
    const results = await Promise.all(pagePromises)
    const riskyPrompts = new Map<string, Prompt>()
    const riskyResponses = new Map<string, LlmResponse>()
    const riskyConversations = new Set<string>()
    const riskyUsers = new Map<string, number>()
    results.forEach(({ prompts }) => {
      prompts.forEach((p) => {
        if (p.risk_score >= 3) {
          riskyPrompts.set(p.id, p)
          p.llm_responses?.forEach((lr) => {
            riskyResponses.set(lr.id, lr)
            riskyConversations.add(p.conversation_id)
          })
          riskyConversations.add(p.conversation_id)
        }
      })
    })

    const conversationPromises = Array.from(riskyConversations).map(
      (conversationId) => externalApi.getConversation(conversationId),
    )
    const conversations = await Promise.all(conversationPromises)
    conversations.forEach((conversation) => {
      riskyUsers.set(
        conversation.user_id,
        (riskyUsers.get(conversation.user_id) || 0) + 1,
      )
    })
    return {
      promptsCount: riskyPrompts.size,
      users: Array.from(riskyUsers.entries()).sort((a, b) => b[1] - a[1]),
      responsesCount: riskyResponses.size,
    }
  },

  getUsers: async ({
    page = 1,
    limit = 100,
    'filter[vip]': vip,
  }: GetUsersParams = {}): Promise<User[]> => {
    const params: Record<string, string | number | undefined> = { page, limit }
    if (vip !== undefined) params['filter[vip]'] = vip
    const res = await fetch(`${BASE_URL}/api/users${buildQuery(params)}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch 'GET /api/users': ${res.statusText}`)
    }
    const data: GetUsersResponse = await res.json()
    return data.users
  },

  getUser: async (id: string): Promise<User> => {
    const res = await fetch(`${BASE_URL}/api/users/${id}`)
    const data: User = await res.json()
    return data
  },

  getPolicies: async ({
    page = 1,
    limit = 100,
  }: GetPoliciesParams = {}): Promise<GetPoliciesResponse> => {
    const res = await fetch(
      `${BASE_URL}/api/policies${buildQuery({ page, limit })}`,
    )
    const data = await res.json()
    return data
  },

  getPolicy: async (id: string): Promise<Policy> => {
    const res = await fetch(`${BASE_URL}/api/policies/${id}`)
    const data: Policy = await res.json()
    return data
  },
}

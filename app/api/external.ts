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

interface GetConversationsResponse extends PaginatedResponse {
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
export interface LlmResponse {
  id: string
  conversation_id: string
  prompt_id: string
  completed_at: string
  model: string
  risk_score: number
  action: 'none' | 'blocked'
  policy_id: string
  output: string | null
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

function buildQuery(params: Record<string, string | number | undefined>): string {
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
  }: GetConversationsParams = {}): Promise<Conversation[]> => {
    const params: Record<string, string | number | undefined> = { page, limit }
    if (userId) params['filter[user_id]'] = userId
    const res = await fetch(`${BASE_URL}/api/conversations${buildQuery(params)}`)
    const data: GetConversationsResponse = await res.json()
    return data.conversations
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
  }: GetPromptsParams = {}): Promise<Prompt[]> => {
    const params: Record<string, string | number | undefined> = { page, limit }
    if (conversationId) params['filter[conversation_id]'] = conversationId
    if (policyId) params['filter[policy_id]'] = policyId
    if (include) params.include = include
    const res = await fetch(`${BASE_URL}/api/prompts${buildQuery(params)}`)
    const data: GetPromptsResponse = await res.json()
    return data.prompts
  },

  getPrompt: async (
    id: string,
    options?: { include?: 'llm_responses' }
  ): Promise<Prompt> => {
    const params: Record<string, string | undefined> = {}
    if (options?.include) params.include = options.include
    const res = await fetch(
      `${BASE_URL}/api/prompts/${id}${buildQuery(params)}`
    )
    const data: Prompt = await res.json()
    return data
  },

  getUsers: async ({
    page = 1,
    limit = 100,
    'filter[vip]': vip,
  }: GetUsersParams = {}): Promise<User[]> => {
    const params: Record<string, string | number | undefined> = { page, limit }
    if (vip !== undefined) params['filter[vip]'] = vip
    const res = await fetch(`${BASE_URL}/api/users${buildQuery(params)}`)
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
  }: GetPoliciesParams = {}): Promise<Policy[]> => {
    const res = await fetch(
      `${BASE_URL}/api/policies${buildQuery({ page, limit })}`
    )
    const data: GetPoliciesResponse = await res.json()
    return data.policies
  },

  getPolicy: async (id: string): Promise<Policy> => {
    const res = await fetch(`${BASE_URL}/api/policies/${id}`)
    const data: Policy = await res.json()
    return data
  },
}
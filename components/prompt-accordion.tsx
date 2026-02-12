// AI generated - "For the complex prompt output, display each prompt in an accordion panel (in the components directory). The prompt text should be truncated and the risk and action should be displayed in the trigger. the body of the accordion should show the llm responses"

'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import ActionDisplay from '@/components/action-display'
import type { Prompt } from '@/app/api/external'
import RiskDisplay from '@/components/risk-display'

const TRUNCATE_LENGTH = 80

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, max)}…`
}

export default function PromptAccordion({ prompts }: { prompts: Prompt[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {prompts.map((prompt) => (
        <AccordionItem key={prompt.id} value={prompt.id}>
          <AccordionTrigger className="flex items-center gap-2 py-3">
            <span className="truncate text-muted-foreground flex-1 text-left">
              {truncate(prompt.text, TRUNCATE_LENGTH)}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <RiskDisplay risk={prompt.risk_score} />
              <ActionDisplay action={prompt.action} />
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {prompt.llm_responses?.length ? (
                prompt.llm_responses.map((lr) => (
                  <div
                    key={lr.id}
                    className="rounded-md border bg-muted/30 p-4 text-sm">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-medium">{lr.model}</span>
                      <RiskDisplay risk={lr.risk_score} />
                      <ActionDisplay action={lr.action} />
                      <span className="text-muted-foreground">
                        {lr.policy_id && `Policy: ${lr.policy_id}`}
                      </span>
                    </div>
                    {lr.output != null && (
                      <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-word text-xs">
                        {typeof lr.output === 'string'
                          ? lr.output
                          : JSON.stringify(lr.output, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No LLM responses
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

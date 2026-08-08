'use client'

import { useState, type FormEvent } from 'react'
import {
  Button,
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormSection,
  Input,
  PageHeader,
  Select,
  Switch,
  Textarea,
  toast,
} from '@arkite-ui/core'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [notify, setNotify] = useState(true)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      // Wire your API here — this fake call just resolves.
      await new Promise((resolve) => setTimeout(resolve, 400))
      toast.success('Settings saved', { description: 'Changes are live for all members.' })
    } catch (err) {
      toast.fromError(err, { prefix: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader title="Settings" description="Workspace configuration." />

      <Form onSubmit={handleSubmit}>
        <FormSection title="Workspace" description="How your workspace appears to members.">
          <FormField name="workspace-name">
            <FormLabel required>Workspace name</FormLabel>
            <FormControl>
              <Input defaultValue="Acme Inc." />
            </FormControl>
          </FormField>

          <FormField name="plan">
            <FormLabel>Plan</FormLabel>
            <FormControl>
              <Select
                defaultValue="pro"
                options={[
                  { value: 'free', label: 'Free' },
                  { value: 'pro', label: 'Pro' },
                  { value: 'enterprise', label: 'Enterprise' },
                ]}
              />
            </FormControl>
          </FormField>

          <FormField name="description">
            <FormLabel optional>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="What is this workspace for?" rows={3} />
            </FormControl>
            <FormDescription>Shown on the tenant switcher.</FormDescription>
          </FormField>

          <FormField name="notifications">
            <div className="flex items-center justify-between">
              <div>
                <FormLabel>Email notifications</FormLabel>
                <FormDescription>Weekly digest and billing alerts.</FormDescription>
              </div>
              <Switch
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                aria-label="Email notifications"
              />
            </div>
          </FormField>
        </FormSection>

        <FormActions>
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        </FormActions>
      </Form>
    </div>
  )
}

'use client'

import { useState, type FormEvent } from 'react'
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  DeleteConfirmDialog,
  FileTrigger,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  toast,
} from '@arkite-ui/core'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [notify, setNotify] = useState(true)
  const [logoName, setLogoName] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader title="Settings" description="Workspace configuration." />

      <Tabs defaultValue="workspace">
        <TabsList>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="danger">Danger zone</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="mt-6">
          <Form onSubmit={handleSubmit}>
            <FormSection title="Workspace" description="How your workspace appears to members.">
              <div className="flex items-center gap-4">
                <Avatar fallback="A" size="lg" />
                {/* FileTrigger is headless — ANY element opens the picker */}
                <FileTrigger
                  accept="image/*"
                  onChange={([file]) => {
                    setLogoName(file.name)
                    toast.success('Logo selected', { description: file.name })
                  }}
                >
                  <Button type="button" variant="outline" size="sm">
                    Change logo
                  </Button>
                </FileTrigger>
                {logoName && (
                  <span className="text-sm text-muted-foreground">{logoName}</span>
                )}
              </div>

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
        </TabsContent>

        <TabsContent value="danger" className="mt-6 space-y-4">
          <Alert variant="destructive">
            Actions here are irreversible. Exports are recommended before deleting anything.
          </Alert>
          <Card>
            <CardHeader
              title="Delete workspace"
              description="Removes all tenants, members, and data."
            />
            <CardContent>
              <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                Delete workspace…
              </Button>
            </CardContent>
          </Card>

          <DeleteConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            itemName="Acme Inc."
            loading={deleting}
            onConfirm={async () => {
              setDeleting(true)
              await new Promise((r) => setTimeout(r, 600))
              setDeleting(false)
              setConfirmOpen(false)
              toast.success('Workspace deleted', { description: '(Not really — this is a demo.)' })
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

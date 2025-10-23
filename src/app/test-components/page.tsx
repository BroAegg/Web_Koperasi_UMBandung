'use client'

import * as React from 'react'
import { Palette, Plus, Download, Trash2, Package, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { PageHeader } from '@/components/ui/page-header'

export default function ComponentsTestPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showEmpty, setShowEmpty] = React.useState(true)

  const handleLoadingTest = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto space-y-8 p-8">
        {/* Page Header */}
        <PageHeader
          title="Component Library Test"
          description="Testing all custom components and design system tokens"
          icon={Palette}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Components', href: '/components' },
            { label: 'Test Page' },
          ]}
          actions={
            <>
              <ThemeToggle />
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Item
              </Button>
            </>
          }
        />

        {/* Design System Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Color System</CardTitle>
            <CardDescription>Testing design system colors in light and dark mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <div className="bg-primary h-16 w-full rounded-lg"></div>
                <p className="text-sm font-medium">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="bg-success h-16 w-full rounded-lg"></div>
                <p className="text-sm font-medium">Success</p>
              </div>
              <div className="space-y-2">
                <div className="bg-warning h-16 w-full rounded-lg"></div>
                <p className="text-sm font-medium">Warning</p>
              </div>
              <div className="space-y-2">
                <div className="bg-destructive h-16 w-full rounded-lg"></div>
                <p className="text-sm font-medium">Destructive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>All button styles from shadcn/ui</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              With Icon
            </Button>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
            <CardDescription>Status indicators and labels</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-success text-success-foreground">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Success
            </Badge>
            <Badge className="bg-warning text-warning-foreground">
              <AlertCircle className="mr-1 h-3 w-3" />
              Warning
            </Badge>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Overview Tab</CardTitle>
                <CardDescription>Main dashboard content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is the overview tab content with stats and metrics.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Tab</CardTitle>
                <CardDescription>Charts and data visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics content with charts will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports Tab</CardTitle>
                <CardDescription>Generated reports and exports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reports listing and download options.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Loading States */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
            <CardDescription>Spinner sizes and variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <LoadingSpinner size="sm" />
                <p className="text-xs">Small</p>
              </div>
              <div className="space-y-2">
                <LoadingSpinner size="md" />
                <p className="text-xs">Medium</p>
              </div>
              <div className="space-y-2">
                <LoadingSpinner size="lg" />
                <p className="text-xs">Large</p>
              </div>
              <div className="space-y-2">
                <LoadingSpinner size="xl" />
                <p className="text-xs">XLarge</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button onClick={handleLoadingTest}>Test Loading Overlay</Button>
              <LoadingOverlay isLoading={isLoading} message="Processing...">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This content will be overlayed when loading.
                    </p>
                  </CardContent>
                </Card>
              </LoadingOverlay>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
            <CardDescription>No data placeholder</CardDescription>
          </CardHeader>
          <CardContent>
            {showEmpty && (
              <EmptyState
                icon={Package}
                title="No items found"
                description="Get started by creating your first item. It only takes a few seconds."
                action={{
                  label: 'Add Item',
                  onClick: () => setShowEmpty(false),
                  icon: Plus,
                }}
              />
            )}
            {!showEmpty && (
              <div className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Content would be displayed here!
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => setShowEmpty(true)} variant="outline">
                    Reset to Empty State
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>Input fields and labels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button>Submit</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>

        {/* Error Boundary Test */}
        <Card>
          <CardHeader>
            <CardTitle>Error Boundary</CardTitle>
            <CardDescription>Error handling component</CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <p className="text-muted-foreground">
                This content is wrapped in an ErrorBoundary. If an error occurs, it will show a
                friendly error message instead of breaking the whole page.
              </p>
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Animations</CardTitle>
            <CardDescription>Design system animations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="animate-fade-in rounded-lg border p-4 text-center">
              <p className="text-sm font-medium">Fade In</p>
            </div>
            <div className="animate-slide-up rounded-lg border p-4 text-center">
              <p className="text-sm font-medium">Slide Up</p>
            </div>
            <div className="animate-scale-up rounded-lg border p-4 text-center">
              <p className="text-sm font-medium">Scale Up</p>
            </div>
          </CardContent>
        </Card>

        {/* Gradients */}
        <Card>
          <CardHeader>
            <CardTitle>Gradient Utilities</CardTitle>
            <CardDescription>Gradient backgrounds and text</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="bg-gradient-primary flex h-24 items-center justify-center rounded-lg">
              <p className="font-semibold text-white">Primary Gradient</p>
            </div>
            <div className="bg-gradient-success flex h-24 items-center justify-center rounded-lg">
              <p className="font-semibold text-white">Success Gradient</p>
            </div>
            <div className="bg-gradient-warning flex h-24 items-center justify-center rounded-lg">
              <p className="font-semibold text-white">Warning Gradient</p>
            </div>
            <div className="bg-gradient-destructive flex h-24 items-center justify-center rounded-lg">
              <p className="font-semibold text-white">Destructive Gradient</p>
            </div>
          </CardContent>
        </Card>

        {/* Glassmorphism */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Glassmorphism</CardTitle>
            <CardDescription>Frosted glass effects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-primary relative h-48 rounded-lg p-6">
              <div className="glass-card absolute inset-4 flex items-center justify-center rounded-lg p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Glass Card</h3>
                  <p className="text-muted-foreground text-sm">
                    Frosted glass effect with backdrop blur
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

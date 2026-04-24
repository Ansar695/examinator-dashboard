import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Icon className="h-10 w-10 text-blue-600" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold text-gray-900 text-center">{title}</h3>
        <p className="mt-2 text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  )
}


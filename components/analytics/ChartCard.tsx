import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const ChartCard = ({ title, description, children, className = "" }: any) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);
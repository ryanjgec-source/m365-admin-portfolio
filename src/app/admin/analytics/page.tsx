"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Loader2, ArrowLeft } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import Link from "next/link"

interface CVDownload {
  id: number
  downloadedAt: string
  ipAddress: string
  userAgent: string
  referrer: string | null
}

interface ChartData {
  date: string
  downloads: number
}

export default function AdminAnalyticsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [downloads, setDownloads] = useState<CVDownload[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin/login")
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session?.user) {
      fetchDownloads()
    }
  }, [session])

  const fetchDownloads = async () => {
    try {
      const response = await fetch("/api/cv-downloads?limit=100")
      if (!response.ok) throw new Error("Failed to fetch downloads")
      const data = await response.json()
      setDownloads(data)
      processChartData(data)
    } catch (error) {
      console.error("Error fetching downloads:", error)
      toast.error("Failed to load download analytics")
    } finally {
      setIsLoading(false)
    }
  }

  const processChartData = (data: CVDownload[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split("T")[0]
    })

    const downloadsByDate = data.reduce((acc, download) => {
      const date = new Date(download.downloadedAt).toISOString().split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const chartData = last30Days.map(date => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      downloads: downloadsByDate[date] || 0
    }))

    setChartData(chartData)
  }

  const getDeviceType = (userAgent: string): string => {
    if (/mobile/i.test(userAgent)) return "Mobile"
    if (/tablet|ipad/i.test(userAgent)) return "Tablet"
    return "Desktop"
  }

  const getBrowser = (userAgent: string): string => {
    if (userAgent.includes("Chrome")) return "Chrome"
    if (userAgent.includes("Safari")) return "Safari"
    if (userAgent.includes("Firefox")) return "Firefox"
    if (userAgent.includes("Edge")) return "Edge"
    return "Other"
  }

  const exportToCSV = () => {
    const headers = ["Date/Time", "IP Address", "Device Type", "Browser", "Referrer"]
    const rows = downloads.map(d => [
      new Date(d.downloadedAt).toLocaleString(),
      d.ipAddress,
      getDeviceType(d.userAgent),
      getBrowser(d.userAgent),
      d.referrer || "Direct"
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cv-downloads-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success("CSV exported successfully")
  }

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">CV Download Analytics</h1>
            <p className="text-muted-foreground">Track resume downloads and visitor insights</p>
          </div>
          <Button onClick={exportToCSV} disabled={downloads.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{downloads.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {downloads.filter(d => {
                  const downloadDate = new Date(d.downloadedAt)
                  const sevenDaysAgo = new Date()
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                  return downloadDate >= sevenDaysAgo
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {downloads.filter(d => {
                  const downloadDate = new Date(d.downloadedAt).toDateString()
                  const today = new Date().toDateString()
                  return downloadDate === today
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Downloads today</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Downloads Over Last 30 Days</CardTitle>
            <CardDescription>Daily download trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="downloads" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Download Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Download Log</CardTitle>
            <CardDescription>Detailed download history with device and browser information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device Type</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Referrer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No downloads recorded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    downloads.map((download) => (
                      <TableRow key={download.id}>
                        <TableCell>
                          {new Date(download.downloadedAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {download.ipAddress}
                        </TableCell>
                        <TableCell>{getDeviceType(download.userAgent)}</TableCell>
                        <TableCell>{getBrowser(download.userAgent)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {download.referrer || "Direct"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

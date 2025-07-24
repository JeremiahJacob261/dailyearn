"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Settings } from "lucide-react"
import { databaseService } from "@/lib/database"

export default function AdminSettingsPage() {
  const [rewardDelay, setRewardDelay] = useState("10")
  const [cooldownTime, setCooldownTime] = useState("20")
  const [minWithdrawal, setMinWithdrawal] = useState("5000")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const settings = await databaseService.getAllSettings()
      setRewardDelay(settings.task_reward_delay_seconds || "10")
      setCooldownTime(settings.task_cooldown_seconds || "20")
      setMinWithdrawal(settings.minimum_withdrawal_amount || "5000")
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      setSaveMessage("")

      // Validate inputs
      const delayValue = parseInt(rewardDelay, 10)
      const cooldownValue = parseInt(cooldownTime, 10)
      const minWithdrawalValue = parseInt(minWithdrawal, 10)

      if (isNaN(delayValue) || delayValue < 1 || delayValue > 300) {
        setSaveMessage("Reward delay must be between 1 and 300 seconds")
        return
      }

      if (isNaN(cooldownValue) || cooldownValue < 1 || cooldownValue > 3600) {
        setSaveMessage("Cooldown time must be between 1 and 3600 seconds")
        return
      }

      if (isNaN(minWithdrawalValue) || minWithdrawalValue < 100 || minWithdrawalValue > 100000) {
        setSaveMessage("Minimum withdrawal amount must be between ₦100 and ₦100,000")
        return
      }

      // Save settings
      await databaseService.updateSetting("task_reward_delay_seconds", rewardDelay)
      await databaseService.updateSetting("task_cooldown_seconds", cooldownTime)
      await databaseService.updateSetting("minimum_withdrawal_amount", minWithdrawal)

      setSaveMessage("Settings saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      setSaveMessage("Error saving settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-500">App Settings</h1>
          <p className="text-gray-600 mt-1">Configure application behavior and timing</p>
        </div>
      </div>

      {/* Settings Card */}
      <Card className="bg-transparent border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-500">Task Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reward Delay Setting */}
          <div className="space-y-2">
            <Label htmlFor="rewardDelay">Task Reward Delay (seconds)</Label>
            <Input
              id="rewardDelay"
              type="number"
              min="1"
              max="300"
              value={rewardDelay}
              onChange={(e) => setRewardDelay(e.target.value)}
              placeholder="10"
              className="max-w-xs"
            />
            <p className="text-sm text-gray-600">
              How long users must wait before receiving their task reward (1-300 seconds)
            </p>
          </div>

          {/* Cooldown Time Setting */}
          <div className="space-y-2">
            <Label htmlFor="cooldownTime">Task Cooldown Time (seconds)</Label>
            <Input
              id="cooldownTime"
              type="number"
              min="1"
              max="3600"
              value={cooldownTime}
              onChange={(e) => setCooldownTime(e.target.value)}
              placeholder="20"
              className="max-w-xs"
            />
            <p className="text-sm text-gray-600">
              How long users must wait before attempting the same task again (1-3600 seconds)
            </p>
          </div>

          {/* Minimum Withdrawal Amount Setting */}
          <div className="space-y-2">
            <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount (₦)</Label>
            <Input
              id="minWithdrawal"
              type="number"
              min="100"
              max="100000"
              value={minWithdrawal}
              onChange={(e) => setMinWithdrawal(e.target.value)}
              placeholder="5000"
              className="max-w-xs"
            />
            <p className="text-sm text-gray-600">
              Minimum amount users can withdraw (₦100 - ₦100,000)
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
            
            {saveMessage && (
              <p className={`text-sm ${
                saveMessage.includes("Error") || saveMessage.includes("must be") 
                  ? "text-red-600" 
                  : "text-green-600"
              }`}>
                {saveMessage}
              </p>
            )}
          </div>

          {/* Current Settings Display */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-500 mb-2">Current Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-gray-500">
                <span className="font-medium text-gray-500">Reward Delay:</span> {rewardDelay} seconds
              </div>
              <div className="text-gray-500">
                <span className="font-medium text-gray-500">Task Cooldown:</span> {cooldownTime} seconds
              </div>
              <div className="text-gray-500">
                <span className="font-medium text-gray-500">Min Withdrawal:</span> ₦{parseInt(minWithdrawal).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

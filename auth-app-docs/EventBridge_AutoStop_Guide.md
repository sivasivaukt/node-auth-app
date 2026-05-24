# AWS EventBridge Scheduler — Auto Stop EC2
**Project:** node-auth-app
**Owner:** Siva Panneerselvam
**Date:** 2026-05-24

---

## What is EventBridge Scheduler?

```
EventBridge Scheduler = AWS Task Scheduler

Like a cron job but on AWS cloud!
Runs any AWS action automatically at a scheduled time.

Examples:
→ Stop EC2 every night at 1:30 AM ✅
→ Start EC2 every morning at 9:00 AM
→ Take database backup every Sunday
→ Send notifications at specific times
```

---

## Why We Need It

```
Problem:
EC2 running 24/7 → uses free tier hours!
t2.micro = 750 hours/month free

Running 24/7 = 744 hours/month (just under limit!)
But if we forget to stop → exceeds limit → charges!

Solution:
EventBridge auto-stops EC2 at 1:30 AM IST daily
Saves free tier hours!
Never worry about forgetting to stop! ✅
```

---

## Our Setup

### Schedule Details
```
Schedule name  → auto-stop-ec2-130am
Status         → Enabled ✅
Timezone       → Asia/Calcutta (IST)
Runs at        → 1:30 AM IST every day
Cron expression → 30 1 * * ? *
```

### Target
```
Service  → Amazon EC2
Action   → StopInstances
Instance → i-0c3cbbd46b91f5bc7 (siva-practice-server)
```

### IAM Role Created
```
Role name      → EventBridgeEC2StopRole
Trusted entity → scheduler.amazonaws.com
Permission     → AmazonEC2FullAccess
```

---

## Cron Expression Explained

```
cron(30 1 * * ? *)

Position 1 → Minutes    → 30  (at 30 minutes)
Position 2 → Hours      → 1   (at 1 AM)
Position 3 → Day/Month  → *   (every day)
Position 4 → Month      → *   (every month)
Position 5 → Day/Week   → ?   (no specific day)
Position 6 → Year       → *   (every year)

Result → Every day at 1:30 AM IST ✅
```

### Common Cron Examples
```
0 9 * * ? *    → Every day at 9:00 AM
30 1 * * ? *   → Every day at 1:30 AM
0 0 * * ? *    → Every day at midnight
0 9 ? * MON *  → Every Monday at 9:00 AM
0 0 1 * ? *    → First day of every month
```

---

## Next Trigger Dates
```
Sun, 24 May 2026 01:30:00 (UTC+05:30) ← TONIGHT!
Mon, 25 May 2026 01:30:00 (UTC+05:30)
Tue, 26 May 2026 01:30:00 (UTC+05:30)
Wed, 27 May 2026 01:30:00 (UTC+05:30)
Thu, 28 May 2026 01:30:00 (UTC+05:30)
...every day at 1:30 AM IST
```

---

## How to Setup (Step by Step)

### Step 1 — Create IAM Role
```
AWS Console → IAM → Roles → Create role

Trusted entity → Custom trust policy
Paste:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "scheduler.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}

Add permission → AmazonEC2FullAccess
Role name → EventBridgeEC2StopRole
Create role ✅
```

### Step 2 — Create Schedule
```
AWS Console → EventBridge → Schedules
Click → Create schedule

Name → auto-stop-ec2-130am
Pattern → Recurring schedule
Timezone → Asia/Calcutta
Type → Cron-based

Cron fields:
Minutes      → 30
Hours        → 1
Day of month → *
Month        → *
Day of week  → ?
Year         → *

Flexible time window → Off
```

### Step 3 — Select Target
```
Target API → All APIs
Search → EC2 → Amazon EC2
Search → StopInstances
Select → Amazon EC2 StopInstances

Input JSON:
{
  "InstanceIds": [
    "i-0c3cbbd46b91f5bc7"
  ]
}
```

### Step 4 — Settings
```
Schedule state → Enable ✅
Execution role → Use existing role
Select → EventBridgeEC2StopRole
Click → Next → Create schedule ✅
```

---

## Important Notes

### Cost
```
EventBridge Scheduler → FREE for first 14 million invocations/month
Our usage → 1 per day = 30/month → FREE! ✅
```

### What Happens When EC2 Stops
```
✅ EC2 stops → no compute charges
✅ Elastic IP stays → IP stays 13.204.38.60
✅ Docker containers stop → restart when EC2 starts
✅ Data preserved → MySQL data safe in Docker volume
```

### Starting EC2 Manually Tomorrow
```
AWS Console → EC2 → Instances
Tick → siva-practice-server
Instance state → Start instance
Wait 2 mins → Running ✅

Then restart Docker:
ssh -i ~/Documents/aws/siva-practice-key.pem ubuntu@13.204.38.60
docker compose up -d
```

### Optional — Auto Start at 9 AM IST
```
Create another schedule:
Name → auto-start-ec2-9am
Cron → 0 9 * * ? *  (9:00 AM IST = 3:30 AM UTC)

But target → EC2 StartInstances
(same instance ID)
```

---

## Interview Answer 🎯

> *"I used AWS EventBridge Scheduler to automatically stop my EC2
> instance every night at 1:30 AM IST to conserve free tier hours.
> I created a cron-based schedule with the expression '30 1 * * ? *'
> and attached an IAM role with EC2FullAccess permissions so EventBridge
> can stop the instance. This runs daily without any manual intervention."*

---

## Quick Reference

| Item | Value |
|------|-------|
| Schedule name | auto-stop-ec2-130am |
| Cron | 30 1 * * ? * |
| Timezone | Asia/Calcutta (IST) |
| Stops at | 1:30 AM IST daily |
| Instance | i-0c3cbbd46b91f5bc7 |
| IAM Role | EventBridgeEC2StopRole |
| Cost | FREE |

---

*EventBridge setup completed: 2026-05-24 — Siva Panneerselvam 💪*

---

## SMS Notification Setup (AWS SNS + CloudWatch)

### What We Built
```
EC2 CPU drops to 0% (server stopped)
         ↓
CloudWatch Alarm triggers
         ↓
SNS Topic → ec2-stop-alert
         ↓
SMS to +919176347983 📱
"EC2 server has stopped!"
```

---

### Step 1 — Create SNS Topic
```
AWS Console → SNS → Topics
Click → Create topic

Type         → Standard
Name         → ec2-stop-alert
Display name → EC2Alert

Click → Create topic ✅
ARN → arn:aws:sns:ap-south-1:381491979505:ec2-stop-alert
```

### Step 2 — Add Phone Subscription
```
Click → Create subscription

Topic ARN → ec2-stop-alert
Protocol  → SMS
Endpoint  → +919176347983

Status → Confirmed ✅
```

### Step 3 — Create CloudWatch Alarm
```
AWS Console → CloudWatch → Alarms
Click → Create alarm → Select metric

EC2 → Per-Instance Metrics
Select → CPUUtilization (siva-practice-server)

Conditions:
Threshold type → Static
Condition      → Lower/Equal <=
Value          → 1

(CPU ≤ 1% means EC2 is stopped!)
```

### Step 4 — Connect Alarm to SNS
```
Alarm state trigger → In alarm
SNS Topic → ec2-stop-alert ✅

Alarm name → EC2-Stopped-Alert
Click → Create alarm ✅
```

---

### Full Notification Flow
```
1:30 AM IST → EventBridge stops EC2
                    ↓
           CPU drops to 0%
                    ↓
    CloudWatch alarm triggers (5 mins)
                    ↓
         SNS sends SMS to phone
                    ↓
   📱 "ALARM: EC2-Stopped-Alert
       CPUUtilization <= 1
       siva-practice-server stopped!"
```

---

### Quick Reference

| Service | Purpose |
|---------|---------|
| EventBridge Scheduler | Stops EC2 at 1:30 AM IST |
| CloudWatch Alarm | Detects CPU = 0 (server stopped) |
| SNS Topic | ec2-stop-alert |
| SMS Phone | +919176347983 |
| Alarm name | EC2-Stopped-Alert |

---

*SNS + CloudWatch setup completed: 2026-05-24 01:05 AM*
*Siva Panneerselvam 💪*

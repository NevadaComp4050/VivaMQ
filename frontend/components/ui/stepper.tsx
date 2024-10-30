import * as React from "react"
import { cn } from "~/lib/utils"

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number
  children: React.ReactNode
}

export function Stepper({ activeStep, children, className, ...props }: StepperProps) {
  const steps = React.Children.toArray(children)

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {step}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-full flex-1 mx-2",
                index < activeStep ? "bg-primary" : "bg-gray-200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  completed?: boolean
}

export function Step({ completed, children, className, ...props }: StepProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        completed ? "text-primary" : "text-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface StepLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  optional?: React.ReactNode
}

export function StepLabel({ optional, children, className, ...props }: StepLabelProps) {
  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      <div className="text-sm font-medium">{children}</div>
      {optional && <div className="text-xs text-gray-400">{optional}</div>}
    </div>
  )
}
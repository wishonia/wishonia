"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CredenzaClose, CredenzaFooter } from "@/components/ui/credenza"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Valence, ratingButtons } from "@/lib/constants/ratings"
import { cn } from "@/lib/utils"
import { GlobalVariable } from "@/types/models/GlobalVariable"
import { UserVariable } from "@/types/models/UserVariable"

interface MeasurementsAddFormProps {
  genericVariable: GlobalVariable | UserVariable
  setShowMeasurementAlert: (active: boolean) => void
}

const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  value: z.number({
    required_error: "A value is required.",
  }),
})

const currentDate = new Date()
currentDate.setHours(0, 0, 0, 0)

export function MeasurementsAddForm({
  genericVariable,
  setShowMeasurementAlert,
}: MeasurementsAddFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: currentDate,
      value: genericVariable.mostCommonValue, // Set default value to genericVariable.mostCommonValue
    },
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const valence = genericVariable.valence

  let buttons = null

  if (
    genericVariable.unitAbbreviatedName === "/5" &&
    ratingButtons[valence as Valence]
  ) {
    buttons = ratingButtons[valence as Valence]
  }

  const handleFaceButtonClick = (numericValue: number) => {
    form.setValue("value", numericValue, { shouldValidate: true })
    form.handleSubmit(onSubmit)() // Trigger form submission after setting the value
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)

    const response = await fetch(`/api/dfda/measurements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startAt: data.date,
        value: data.value, // Use the value from the form
        variableId: genericVariable.variableId,
      }),
    })

    if (!response?.ok) {
      toast({
        title: "Something went wrong.",
        description:
          genericVariable.name + " was not recorded. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        description:
          "Recorded " +
          data.value +
          " " +
          genericVariable.unitAbbreviatedName +
          " for " +
          genericVariable.name +
          " on " +
          format(data.date, "PPP"),
      })
    }

    setIsLoading(false)
    setShowMeasurementAlert(false)

    router.refresh()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-4 md:px-0"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal sm:w-[320px]",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Date of the measured event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {buttons ? (
          <div className="flex w-full justify-around">
            {buttons.map(
              (option: {
                numericValue: number
                src: string
                title: string
              }) => (
                <img
                  key={option.numericValue}
                  src={option.src}
                  title={option.title}
                  className={`cursor-pointer ${form.watch("value") === option.numericValue ? "active-primary-outcome-variable-rating-button" : ""} w-auto max-w-[20%]`}
                  onClick={() => handleFaceButtonClick(option.numericValue)}
                  alt={`Rating ${option.numericValue}`}
                />
              )
            )}
          </div>
        ) : (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{genericVariable.name} Value</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <input
                      id="value-input"
                      type="number"
                      className="w-full"
                      min={genericVariable.minimumAllowedValue} // Set minimum allowed value
                      max={genericVariable.maximumAllowedValue} // Set maximum allowed value
                      {...field}
                    />
                    <span className="ml-2">
                      {genericVariable.unitAbbreviatedName}
                    </span>
                  </div>
                </FormControl>
                <FormDescription>Value of the measurement</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <CredenzaFooter className="flex flex-col-reverse">
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.add className="mr-2 h-4 w-4" />
            )}
            <span>Record measurement</span>
          </Button>
        </CredenzaFooter>
      </form>
    </Form>
  )
}

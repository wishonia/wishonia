"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { variableCategories } from "@/app/dfda/lib/variableCategories"
import { GlobalVariable } from "@/types/models/GlobalVariable"
import { UserVariable } from "@/types/models/UserVariable"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createMeasurement } from "./measurementActions"
import { Valence, ratingButtons } from "@/lib/constants/ratings"

const measurementFormSchema = z.object({
  variableName: z.string().min(1, "Variable name is required"),
  variableCategoryName: z.string().min(1, "Category is required"),
  value: z.number().or(z.string()).optional(),
  unitAbbreviatedName: z.string().min(1, "Unit is required"),
  note: z.string().optional(),
  startAt: z.date(),
})

type MeasurementFormValues = z.infer<typeof measurementFormSchema>

interface MeasurementFormProps {
  variable?: GlobalVariable | UserVariable
}

export function MeasurementForm({ variable }: MeasurementFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  const defaultValues: Partial<MeasurementFormValues> = {
    startAt: new Date(),
    ...(variable && {
      variableName: variable.name,
      variableCategoryName: variable.variableCategoryName,
      unitAbbreviatedName: variable.unitAbbreviatedName,
      value: variable.mostCommonValue,
    })
  }

  const form = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues,
  })

  const handleFaceButtonClick = (numericValue: number) => {
    form.setValue("value", numericValue, { shouldValidate: true })
  }

  async function onSubmit(data: MeasurementFormValues) {
    try {
      setLoading(true)
      
      const result = await createMeasurement({
        ...data,
        variableId: variable?.variableId,
      })

      if (!result.success) throw new Error(result.error)

      toast({
        description: `Recorded ${data.value} ${data.unitAbbreviatedName} for ${data.variableName} on ${format(data.startAt, "PPP")}`,
      })

      router.push("/dfda/safe/measurements")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save measurement",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Determine if we should show rating buttons
  const showRatingButtons = variable?.unitAbbreviatedName === "/5" && variable?.valence
  const buttons = showRatingButtons ? ratingButtons[variable.valence as Valence] : null

  // Check if we have an existing variable
  const isExistingVariable = Boolean(variable?.variableId)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!isExistingVariable && (
          <>
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-bold">Variable Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter variable name" 
                      {...field}
                      className="border-2 border-black bg-white text-black placeholder:text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variableCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-bold">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-2 border-black bg-white">
                      {variableCategories.map((category) => (
                        <SelectItem 
                          key={category.name} 
                          value={category.name}
                          className="hover:bg-gray-100"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Value</FormLabel>
              {buttons ? (
                <div className="flex w-full justify-around items-center">
                  {buttons.map((option) => (
                    <img
                      key={option.numericValue}
                      src={option.src}
                      title={option.title}
                      className={`cursor-pointer ${
                        form.watch("value") === option.numericValue 
                          ? "brightness-110 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                          : "brightness-90 hover:brightness-100 scale-75 hover:scale-90"
                      } w-auto max-w-[20%] transition-all duration-200 rounded-full`}
                      onClick={() => handleFaceButtonClick(option.numericValue)}
                      alt={`Rating ${option.numericValue}`}
                    />
                  ))}
                </div>
              ) : (
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder="Enter value"
                      min={variable?.minimumAllowedValue}
                      max={variable?.maximumAllowedValue}
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                      className="border-2 border-black bg-white text-black placeholder:text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <span className="text-sm font-bold text-black">
                      {variable?.unitAbbreviatedName}
                    </span>
                  </div>
                </FormControl>
              )}
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-black font-bold">Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all",
                        !field.value && "text-gray-500"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP HH:mm")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="border-2 border-black bg-white p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="bg-white"
                  />
                  <div className="p-3 border-t-2 border-black">
                    <Input
                      type="time"
                      value={format(field.value || new Date(), "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":")
                        const newDate = new Date(field.value || new Date())
                        newDate.setHours(parseInt(hours))
                        newDate.setMinutes(parseInt(minutes))
                        field.onChange(newDate)
                      }}
                      className="border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription className="text-gray-600">When this measurement was taken</FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Note</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional notes..."
                  className="resize-none border-2 border-black bg-white text-black placeholder:text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
            className="border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="border-2 border-black bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Record Measurement"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
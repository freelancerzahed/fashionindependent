"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import BodyViewerUpdate from "@/components/body-viewer-update"

export default function EditBodyShapePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialUserResponses, setInitialUserResponses] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch data only once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const fetchBodyData = async () => {
      try {
        const res = await fetch(`/api/body-data`)
        // Check if response is ok
        if (!res.ok) {
          if (isMounted) {
            // Fallback to default if error
            setInitialUserResponses({
              name: "",
              age_range: "",
              gender: "female",
              bodyType: "average",
              shape_keys: {},
              slider_values: {}
            } as any)
            setLoading(false)
          }
          return;
        }
        
        const text = await res.text();
        if (!text) {
          // Handle empty response
          if (isMounted) {
            setInitialUserResponses({
              name: "",
              age_range: "",
              gender: "female",
              bodyType: "average",
              shape_keys: {},
              slider_values: {}
            } as any)
            setLoading(false)
          }
          return;
        }
        
        let result;
        try {
          result = JSON.parse(text);
        } catch (parseError) {
          if (isMounted) {
            // Fallback to default if parsing fails
            setInitialUserResponses({
              name: "",
              age_range: "",
              gender: "female",
              bodyType: "average",
              shape_keys: {},
              slider_values: {}
            } as any)
            setLoading(false)
          }
          return;
        }
        
        if (isMounted) {
          if (result.success && result.data) {
            setInitialUserResponses({
              name: "", // Name not in API response
              age_range: result.data.age,
              gender: result.data.gender,
              bodyType: result.data.shape || "average",
              // Add shape_keys and slider_values to user responses
              shape_keys: result.data.shape_keys || {},
              slider_values: result.data.slider_values || {}
            } as any)
          } else {
            // Fallback to default if no data
            setInitialUserResponses({
              name: "",
              age_range: "",
              gender: "female",
              bodyType: "average",
              shape_keys: {},
              slider_values: {}
            } as any)
          }
          setLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          // Fallback to default if error
          setInitialUserResponses({
            name: "",
            age_range: "",
            gender: "female",
            bodyType: "average",
            shape_keys: {},
            slider_values: {}
          } as any)
          setLoading(false)
        }
      }
    }

    fetchBodyData()
    
    return () => {
      isMounted = false
    }
  }, [])

  const handleComplete = async (data: {
    shape: string
    shape_keys: any
    slider_values: Record<string, number>
    alphanumeric_code: string
  }) => {
    try {
      // Prepare the body shape data
      const bodyShapeData = {
        shape: data.shape,
        shape_keys: data.shape_keys,
        slider_values: data.slider_values,
        alphanumeric_code: data.alphanumeric_code,
      }

      // Update body data
      const saveResponse = await fetch('/api/body-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyShapeData),
      })

      // Handle response
      if (!saveResponse.ok) {
        throw new Error(`HTTP error! status: ${saveResponse.status}`);
      }
      
      const saveText = await saveResponse.text();
      
      // If empty response but status is OK, consider it a success
      if (!saveText) {
        toast({
          title: "Success",
          description: "Body shape updated successfully.",
        })
        router.push('/profile/shape-summary')
        return;
      }
      
      // Try to parse JSON response
      let saveResult;
      try {
        saveResult = JSON.parse(saveText);
      } catch (parseError) {
        // If we can't parse but status is OK, still consider it a success
        toast({
          title: "Success",
          description: "Body shape updated successfully.",
        })
        router.push('/profile/shape-summary')
        return;
      }
      
      // Handle success or error based on response
      if (saveResult.success) {
        toast({
          title: "Success",
          description: saveResult.message || "Body shape updated successfully.",
        })
        router.push('/profile/shape-summary')
      } else {
        throw new Error(saveResult.message || "Failed to update body shape.")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update body shape.",
        variant: "destructive",
      })
    }
  }

  if (loading || !initialUserResponses) {
    return <Skeleton className="w-full h-96" />
  }

  return (
    <BodyViewerUpdate
        userResponses={initialUserResponses}
        onComplete={handleComplete}
        onChange={() => setHasUnsavedChanges(true)}
      />
  )
}

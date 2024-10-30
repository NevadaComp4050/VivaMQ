'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Loader2, PlusIcon, ArrowLeft } from 'lucide-react'
import { useToast } from '~/components/ui/use-toast'
import createApiClient from '~/lib/api-client'

enum Term {
  SESSION_1 = 'SESSION_1',
  SESSION_2 = 'SESSION_2',
  SESSION_3 = 'SESSION_3',
  ALL_YEAR = 'ALL_YEAR'
}

export default function UnitCreationPage() {
  const [newUnit, setNewUnit] = useState({
    name: '',
    year: new Date().getFullYear(),
    term: '' as Term | '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ name: '', year: '', term: '' })
  
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()

  const validateForm = () => {
    let isValid = true
    const newErrors = { name: '', year: '', term: '' }

    if (!newUnit.name.trim()) {
      newErrors.name = 'Unit name is required'
      isValid = false
    }

    if (!newUnit.year) {
      newErrors.year = 'Year is required'
      isValid = false
    }

    if (!newUnit.term) {
      newErrors.term = 'Term is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleCreateUnit = async () => {
    if (validateForm()) {
      setIsLoading(true)
      try {
        const apiClient = createApiClient(session?.user?.accessToken)
        await apiClient.post('/units', newUnit)
        setNewUnit({ name: '', year: new Date().getFullYear(), term: '' })
        setErrors({ name: '', year: '', term: '' })

        toast({
          title: 'Success',
          description: 'Unit created successfully.',
          duration: 3000,
        })

        router.push('/dashboard')
      } catch (error) {
        console.error('Error creating unit:', error)
        toast({
          title: 'Error',
          description: 'Failed to create unit. Please try again.',
          variant: 'destructive',
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUnit((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSelectChange = (name: 'year' | 'term', value: string) => {
    if (name === 'year') {
      const parsedValue = parseInt(value, 10)
      setNewUnit((prev) => ({ ...prev, [name]: parsedValue }))
    } else {
      setNewUnit((prev) => ({ ...prev, [name]: value as Term }))
    }
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-4xl font-bold">Create New Unit</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Unit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Unit Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter unit name"
                  name="name"
                  value={newUnit.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'border-red-500' : ''}
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="year" className="block text-sm font-medium mb-2">
                  Year
                </label>
                <Select
                  value={newUnit.year.toString()}
                  onValueChange={(value) => handleSelectChange('year', value)}
                >
                  <SelectTrigger id="year" className={errors.year ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <AnimatePresence>
                  {errors.year && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.year}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="md:col-span-2"
              >
                <label htmlFor="term" className="block text-sm font-medium mb-2">
                  Term
                </label>
                <Select
                  value={newUnit.term}
                  onValueChange={(value) => handleSelectChange('term', value)}
                >
                  <SelectTrigger id="term" className={errors.term ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Term.SESSION_1}>Session 1</SelectItem>
                    <SelectItem value={Term.SESSION_2}>Session 2</SelectItem>
                    <SelectItem value={Term.SESSION_3}>Session 3</SelectItem>
                    <SelectItem value={Term.ALL_YEAR}>All Year</SelectItem>
                  </SelectContent>
                </Select>
                <AnimatePresence>
                  {errors.term && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.term}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleCreateUnit} 
                  disabled={isLoading || !session}
                  className="w-full"
                >
                  {isLoading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating...
                    </motion.span>
                  ) : (
                    <motion.span className="flex items-center justify-center">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Unit
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
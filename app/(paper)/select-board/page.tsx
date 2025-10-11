'use client'

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import CustomSpinner from '@/components/shared/CustomSpinner';
import { Board, useGetBoardsQuery } from '@/lib/api/educationApi';

const BoardSelection = () => {
    const router = useRouter()
    const { toast } = useToast()

    const {data: boards, isLoading, error} = useGetBoardsQuery();
  console.log("Boards data:", boards);
    useEffect(() => {
      if (error) {
        console.error('Error fetching boards:', error);
        toast({
          variant: 'destructive',
          title: "Error",
          description: "Failed to load boards. Please refresh the page.",
        })
      }
      
      if (boards && boards.length === 0) {
        toast({
          title: "No boards found",
          description: "There are no boards available yet.",
        })
      }
    }, [boards])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Toaster />
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Select Your Educational Board
          </h1>
          <p className="text-xl text-gray-600">
            Choose your board to access curriculum-aligned question banks and paper templates
          </p>
        </motion.div>

        {/* Boards Grid */}
        {isLoading ? <CustomSpinner /> :
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {boards?.map((board: Board, index: number) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className=" rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Image 
                        src={board.logoUrl || "/placeholder.svg"}
                        alt='board'
                        width={84}
                        height={84}
                        className='w-16 h-16 rounded-md object-cover'
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-1">{board?.name}</h2>
                      <p className="text-sm text-gray-500 mb-4">{board?.name}</p>
                      <p className="text-gray-600 mb-6">{board?.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Available Subjects</p>
                          {/* <p className="font-semibold text-gray-700">{board?.subjects?.length}</p> */}
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Class Range</p>
                          {/* <p className="font-semibold text-gray-700">{board?.classes?.length}</p> */}
                        </div>
                      </div>

                      <Button 
                        className="w-full group-hover:bg-blue-600 transition-colors"
                        onClick={() => {
                            router.push(`/${board?.id}/select-class`)
                        }}
                      >
                        <span>Select Board</span>
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        }

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600">
            Don&apos;t see your board? More boards coming soon.
            <Button variant="link" className="text-blue-600 hover:text-blue-700">
              Get notified when your board is added
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BoardSelection;
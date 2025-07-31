import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { FieldData } from "./TaskType"
import { BookMarked, CheckLine, Goal, X } from "lucide-react"
import { useEffect, useState } from "react"


type Props = {
    option : string
}


 const GetData = ({option} : Props )=>{
const [filteredData, setFilteredData] = useState<FieldData[]>([]);
const queryClient = useQueryClient()

    const {data} = useQuery<FieldData[]>({
        queryKey : ["tasks"],
        queryFn : () => fetch("https://688bce19cd9d22dda5cb5584.mockapi.io/api/v1/tasks").then((res) => res.json()),
    })


    const taskComplated = useMutation({
        mutationFn : (item : FieldData) => fetch (`https://688bce19cd9d22dda5cb5584.mockapi.io/api/v1/tasks/${item.id}`, {
            method : "PUT",
            body:JSON.stringify({
            completed : !item.completed,
            task : item.task
            }),
            headers:{
                "Content-type" : "application/json"
            }
        }).then((res) => res.json()),
        onSuccess : ()=>{
queryClient.invalidateQueries({queryKey:["tasks"]})
        }
    })


        const deleteTask = useMutation({
        mutationFn : (item : FieldData) => fetch (`https://688bce19cd9d22dda5cb5584.mockapi.io/api/v1/tasks/${item.id}`, {
            method : "DELETE",
          
            headers:{
                "Content-type" : "application/json"
            }
        }).then((res) => res.json()),
                onSuccess : ()=>{
queryClient.invalidateQueries({queryKey:["tasks"]})
        }
    })


 

useEffect(() => {
  if (option === "complated") {
    setFilteredData(data?.filter((item) => item.completed === true) || []);
  } else if (option === "notComplated") {
    setFilteredData(data?.filter((item) => item.completed === false) || []);
  } else {
    setFilteredData(data || []);
  }
}, [option, data]);



return(
    <div>
        {filteredData.length === 0 ? (


<div  className="text-gray-400 h-[40vh] flex flex-col items-center justify-center gap-4 ">

<BookMarked size={90} strokeWidth={1.25} />
<span className="text-3xl">No Task</span>
</div>

        ) : 
        
(  <ul>
        {filteredData && filteredData.map((item) => (
            <div key={item.id} className="flex items-center border-b-1 border-gray-300 py-3">

            <li onClick={()=> taskComplated.mutate(item)}  className={`flex items-center text-blue-950  w-full gap-2   hover:text-gray-400 hover:line-through cursor-pointer ${item.completed ? "text-gray-400 line-through" : ""} `}><span>{item.completed ? <CheckLine size={22} strokeWidth={1.2} /> :<Goal size={22} strokeWidth={1.2} />}</span> {item.task}</li>
           <X className="ml-auto" size={22} strokeWidth={1.2} onClick={()=> deleteTask.mutate(item)}  />
            </div>
        ))}

    </ul> )}
        </div>
)

}  

export default GetData
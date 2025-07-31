import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpFromLine, Loader } from "lucide-react";


import { useForm, type SubmitHandler } from "react-hook-form";
import {  z } from "zod";
import GetData from "./components/GetData";
import { useState } from "react";

type FieldData = {
  completed : boolean;
  task : string

}






function App() {

  const [option , setOption] = useState<string>("")
const queryClient = useQueryClient()

 


  const schema = z.object({
    task: z.string().min(8, { message: "Please Enter Task" }),
  });
  type FieldTask = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FieldTask>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FieldTask> = async (data) => {
    try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form data:", data);
    await postTask.mutateAsync({ completed: false, task: data.task   });
    reset();
  } catch (error) {
    console.error("Error posting task:", error);
  }
   
  };


  const postTask = useMutation({
    mutationFn : (newTask : FieldData ) => fetch("http://localhost:3000/tasks" , {
      method : "POST",
      body : JSON.stringify(newTask),
headers:{
  "content-type" : "application/json"
}


    }).then((res) => res.json()),
            onSuccess : ()=>{
queryClient.invalidateQueries({queryKey:["tasks"]})
        }

  })

  return (
    <div className="w-screen relative h-auto min-h-[100vh] z-0 bg-blue-50 flex items-center justify-center b">
      <div className="w-full h-[40vh] z-[-1] bg-blue-300 absolute top-0 left-0"></div>
      <div className="bg-white w-[40%] min-h-[60vh] rounded-[.5rem] shadow-2xs flex flex-col  py-4 px-5 ">
        <h2 className="text-4xl mb-5 font-extrabold text-blue-950">
          T<span className="text-blue-300">o</span>d
          <span className="text-blue-300">o</span>.
        </h2>
        <div className="flex w-full gap-2 border-b-1 border-gray-200 ">
          <form
           onSubmit={handleSubmit(onSubmit)}
            className="flex  w-full items-center border-r-1 border-gray-200"
          >
            <input
              {...register("task")}
              type="text"
            
              placeholder="add new task"
              className="outline-none py-2  w-full  "
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center  px-2 justify-center   transition"
            >
              {isSubmitting ? (
               
               
               <Loader size={20} strokeWidth={1.5} className="cursor-pointer"/>
              ) : (
                 <ArrowUpFromLine   size={20}
                  strokeWidth={1.5}
                  color="gray"
                  className=" cursor-pointer " />
              )}
            </button>
          </form>
          <select
            name="options"
            className="w-[40%] outline-none text-gray-400 "
           onChange={(e)=> setOption(e.target.value)}
          >
            <option value="all">All</option>
            <option value="complated">Complated</option>
            <option value="notComplated">N.Complated</option>
          </select>
        </div>
        <div className=" h-6 text-[.8rem] text-red-600">
          {errors.task && <p>{errors.task.message}</p>}
        </div>
 
          
          <GetData option={option}/>
   
      </div>
    </div>
  );
}

export default App;

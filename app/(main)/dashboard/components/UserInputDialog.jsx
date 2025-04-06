import { UserContext } from "@/app/_context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/options";
import { useMutation } from "convex/react";
import { Loader, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

function UserInputDialog({ children, coachingOptions }) {
  const [selectedExpert, setSelectedExpert] = useState();
  const [topic, setTopic] = useState();
  const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom)
  const [loading,setLoading] =  useState(false)
  const [openDialog,setOpenDialog] = useState(false)
  const router = useRouter();
  const {userData} = useContext(UserContext)

  const OnClickNext=async()=>{
    setLoading(true)
    console.log(userData._id)
    const result = await createDiscussionRoom({
      topic:topic,
      coachingOption:coachingOptions?.name,
      expertName:selectedExpert,
      uid: userData._id
    })
    console.log(result)
    setLoading(false)
    setOpenDialog(false)
    router.push('/discussion-room/'+result)
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coachingOptions.name}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2 className="text-black">
                Enter a topic to master your skill in {coachingOptions.name}
              </h2>
              <Textarea
                placeholder="Enter your topic here..."
                className="mt-2"
                onChange={(e) => {
                  setTopic(e.target.value);
                }}
              />

              <h2 className="text-black mt-5">Select the expert name</h2>
              <div className="grid grid-cols-3 gap-6 place-items-center">
                {CoachingExpert.map((expert, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedExpert(expert.name)}
                  >
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      width={100}
                      height={100}
                      className={`rounded-2xl h-[80px] w-[80px] object-cover
                          hover:scale-105 transition-all pt-0.5 cursor-pointer p-1 border-primary
                          ${selectedExpert == expert.name && "border"}`}
                    />
                    <h2 className="text-center">{expert.name}</h2>
                  </div>
                ))}
              </div>
              <div className="flex gap-5 justify-end mt-5">
                <DialogClose asChild>
                  <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button disabled={!topic || !selectedExpert || loading} onClick={OnClickNext}>
                  {loading && <LoaderCircle className="animate-spin" />}
                  Next
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UserInputDialog;

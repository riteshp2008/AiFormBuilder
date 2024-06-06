"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiChatSession } from "@/configs/AiModal";
import { useUser } from "@clerk/nextjs";
import { JsonForms } from "@/configs/schema";
import moment from "moment/moment";
import { db } from "@/configs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const PROMPT =
  ", On basis of description create JSON form with formTitle, formHeading along with fieldName, fieldTitle, fieldType, placeholderName, label and require formFields in json format.";
function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState();
  const { user } = useUser();
  const route = useRouter();

  const onCreateForm = async () => {
    setLoading(true);
    const result = await AiChatSession.sendMessage(
      "Description :" + userInput + PROMPT
    );
    console.log(result.response.text());
    if (result.response.text()) {
      const resp = await db
        .insert(JsonForms)
        .values({
          form: result.response.text(),
          CreatedBy: user?.primaryEmailAddress?.emailAddress,
          CreatedDate: moment().format("DD/MM/YYYY"),
        })
        .returning({ id: JsonForms.id });
      console.log("New Form ID ", resp[0].id);
      if (resp[0].id) {
        route.push("/edit-form/" + resp[0].id);
      }
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                onChange={(event) => setUserInput(event.target.value)}
                className="my-2"
                placeholder="Write description of your form"
              />
              <div className="flex gap-2 my-3 justify-between">
                <Button disabled={loading} onClick={() => onCreateForm()}>
                  {loading ? <Loader2 className="animate-spin" /> : "Create"}
                </Button>
                <Button
                  onClick={() => setOpenDialog(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateForm;

import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";
import { Button } from "@/components/ui/button";
import { userResponses } from "@/configs/schema";
import { db } from "@/configs";
import moment from "moment";
import { toast } from "sonner";
import { SignInButton, useUser } from "@clerk/nextjs";

function FormUi({
  jsonForm,
  selectedTheme,
  selectedStyle,
  onFieldUpdate,
  deleteField,
  editable = true,
  formId = 0,
  enableSignIn = false,
}) {
  const [formData, setFormData] = useState();
  let formRef = useRef();
  const { user, isSignedIn } = useUser();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    const result = await db.insert(userResponses).values({
      jsonResponse: formData,
      CreatedAt: moment().format("DD/MM/yyy"),
      formRef: formId,
    });

    if (result) {
      formRef.reset();
      toast("Response Submitted Successfully !");
    } else {
      toast("Error while saving your form !");
    }
  };

  const handleCheckboxChange = (fieldName, itemName, value) => {
    const list = formData?.[fieldName] ? formData?.[fieldName] : [];

    if (value) {
      list.push({
        label: itemName,
        value: value,
      });
      setFormData({
        ...formData,
        [fieldName]: list,
      });
    } else {
      const result = list.filter((item) => item.label == itemName);
      setFormData({
        ...formData,
        [fieldName]: result,
      });
    }
  };

  return (
    <form
      ref={(e) => (formRef = e)}
      onSubmit={onFormSubmit}
      className="border p-5 md:w-[600px] rounded-lg"
      data-theme={selectedTheme}
      style={{
        boxShadow: selectedStyle?.key == "boxshadow" && "5px 5px 0px black",
        border: selectedStyle?.key == "border" && selectedStyle.value,
      }}
    >
      <h2 className="font-bold text-center text-2xl text-primary">
        {jsonForm?.formTitle}
      </h2>
      <h2 className="text-sm text-gray-500 text-center">
        {jsonForm?.formHeading}
      </h2>
      {jsonForm?.formFields?.map((formFields, index) => (
        <div className="flex items-center gap-2" key={index}>
          {formFields?.fieldType == "select" ? (
            <div className="my-3 w-full">
              <label className="text-sm text-primary">{formFields.label}</label>
              <Select
                required={formFields?.required}
                onValueChange={(v) =>
                  handleSelectChange(formFields.fieldName, v)
                }
              >
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder={formFields.placeholderName} />
                </SelectTrigger>
                <SelectContent>
                  {formFields.options.map((item, index) => (
                    <SelectItem key={index} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : formFields.fieldType == "radio" ? (
            <div className="my-3 w-full">
              <label className="text-sm text-primary">{formFields.label}</label>
              <RadioGroup required={formFields?.required}>
                {formFields.options.map((item, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem
                      onClick={() =>
                        handleSelectChange(formFields.fieldName, item.label)
                      }
                      value={item.label}
                      id={item.label}
                    />
                    <Label htmlFor={item.label}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : formFields.fieldType == "checkbox" ? (
            <div className="my-3 w-full">
              <label className="text-sm text-primary">
                {formFields?.label}
              </label>
              {formFields?.options ? (
                formFields?.options?.map((item, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <Checkbox
                      onCheckedChange={(v) =>
                        handleCheckboxChange(
                          formFields?.label,
                          item.label ? item.label : item,
                          v
                        )
                      }
                      value={item.value}
                    />
                    <h2>{item.label ? item.label : item}</h2>
                  </div>
                ))
              ) : (
                <div className="flex gap-2 items-center">
                  <Checkbox required={formFields?.required} />
                  <h2>{formFields.label}</h2>
                </div>
              )}
            </div>
          ) : (
            <div className="my-3 w-full">
              <label className="text-sm text-primary">{formFields.label}</label>
              <Input
                type={formFields?.fieldType}
                placeholder={formFields?.placeholderName}
                name={formFields?.fieldName}
                className="bg-transparent"
                required={formFields?.required}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          )}

          {editable && (
            <div>
              <FieldEdit
                defaultValue={formFields}
                selectedTheme={selectedTheme}
                onUpdate={(value) => onFieldUpdate(value, index)}
                deleteField={() => deleteField(index)}
              />
            </div>
          )}
        </div>
      ))}
      {!enableSignIn ? (
        <button className="btn btn-primary"> Submit </button>
      ) : isSignedIn ? (
        <button className="btn btn-primary"> Submit </button>
      ) : (
        <Button>
          <SignInButton mode="modal">Sign In before submit</SignInButton>
        </Button>
      )}
    </form>
  );
}

export default FormUi;

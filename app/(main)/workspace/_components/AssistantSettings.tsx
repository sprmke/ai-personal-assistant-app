'use client';

import React, { useContext, useState } from 'react';

import Image from 'next/image';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Loader2Icon, Save, Trash } from 'lucide-react';

import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/magicui/blur-fade';

import { aiModelOptions } from '@/services/AiModelOptions';

import { AssistantContext } from '@/context/AssistantContext';

import type { AiAssistant } from '@/app/(main)/types';
import AssistantConfirmationAlert from './AssistantConfirmationAlert';

function AssistantSettings() {
  const { assistant, setAssistant } = useContext(AssistantContext);

  const updateAssistant = useMutation(
    api.userAiAssistants.updateUserAiAssistant
  );
  const deleteAssistant = useMutation(api.userAiAssistants.deleteAssistant);

  const [loading, setLoading] = useState(false);

  const onHandleInputChange = (field: keyof AiAssistant, value: string) => {
    setAssistant({ ...assistant, [field]: value } as AiAssistant);
  };

  const OnSave = async () => {
    if (!assistant) return;
    setLoading(true);

    await updateAssistant({
      id: assistant._id,
      aiModelId: assistant.aiModelId,
      userInstruction: assistant.userInstruction ?? '',
    });

    toast('AI assistant settings updated!');
    setLoading(false);
  };

  const OnDelete = async () => {
    if (!assistant) return;

    setLoading(true);

    await deleteAssistant({
      id: assistant._id,
    });

    setAssistant(null);
    setLoading(false);
  };

  return (
    assistant && (
      <div className="p-5 bg-secondary border-l-[1px] h-screen">
        <BlurFade delay={0.25}>
          <div className="mt-4 flex gap-3">
            <Image
              src={assistant?.image}
              alt="assistant"
              width={100}
              height={100}
              className="rounded-xl h-[80px] w-[80px] object-cover"
            />
            <div>
              <h2 className="font-bold">{assistant?.name}</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {assistant?.title}
              </p>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={0.25 * 2}>
          <div className="mt-4">
            <h2 className="text-gray-500">Model:</h2>
            <Select
              defaultValue={assistant.aiModelId}
              onValueChange={(value) => onHandleInputChange('aiModelId', value)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {aiModelOptions.map(({ id, logo, name }, index) => (
                  <SelectItem value={id} key={index}>
                    <div className="flex gap-2 items-center m-1">
                      <Image
                        src={logo}
                        alt={name}
                        width={20}
                        height={20}
                        className="rounded-md"
                      />
                      <h2>{name}</h2>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </BlurFade>
        <BlurFade delay={0.25 * 3}>
          <div className="mt-4">
            <h2 className="text-gray-500">Instructions:</h2>
            <Textarea
              placeholder="Add Instructions"
              className="h-[180px] bg-white"
              value={assistant?.userInstruction}
              onChange={(e) =>
                onHandleInputChange('userInstruction', e.target.value)
              }
            />
          </div>
        </BlurFade>
        <div className="absolute bottom-10 right-5 flex gap-5">
          <AssistantConfirmationAlert OnDelete={OnDelete}>
            <Button disabled={loading} variant="ghost">
              <Trash /> Delete
            </Button>
          </AssistantConfirmationAlert>
          <Button onClick={OnSave} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : <Save />} Save
          </Button>
        </div>
      </div>
    )
  );
}

export default AssistantSettings;

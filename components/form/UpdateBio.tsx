"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button";
import ModalContainer from "../container/modalContainer";
import TextArea from "../ui/textarea";
import { Icon } from "@iconify/react/dist/iconify.js";

type UpdateBioProps = {
  initialBio: string;
  onClose: () => void;
  onSave: (bio: string) => void | Promise<void>;
};

const UpdateBio: React.FC<UpdateBioProps> = ({
  initialBio,
  onClose,
  onSave,
}) => {
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBio(initialBio);
  }, [initialBio]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(bio);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalContainer>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Create Ask Post</h2>
        <Icon
          icon="ic:round-close"
          className="size-6 cursor-pointer "
          onClick={onClose}
        />
      </div>
      <TextArea
        placeholder="Write something..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <div className="flex justify-end space-x-4">
        <Button
          title={saving ? "Saving..." : "Save"}
          size="small"
          onClick={handleSave}
          disabled={saving}
        />
      </div>
    </ModalContainer>
  );
};

export default UpdateBio;

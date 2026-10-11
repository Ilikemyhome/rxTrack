import React from "react";

type BackButtonProps = {
  onClick: () => void;
};

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button className="back-button" onClick={onClick} type="button">
      Back
    </button>
  );
}

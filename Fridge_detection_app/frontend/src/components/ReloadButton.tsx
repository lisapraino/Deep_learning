import React from "react";

interface ReloadButtonProps {
    onButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ReloadButton = ({onButtonClick}: ReloadButtonProps) => {
    return (
        <div>
            <button onClick={onButtonClick}>Reload</button>
        </div>
    );
}
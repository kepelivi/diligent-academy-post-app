import React, { useState } from "react";

interface InputField {
  type: "text" | "email";
  label: string;
  value: string | number;
}

interface InputModalProps {
  inputFields: InputField[];
  submitHandler: (id: number, values: inputState) => void;
  cancelHandler: ()=>void;
  id: number;
  title: string;
}

export interface inputState {
  [key: string]: string | number;
}

const InputModal: React.FC<InputModalProps> = ({
  inputFields,
  submitHandler,
  id,
  title,
  cancelHandler,
}) => {
  const [inputValues, setInputValues] = useState<inputState>({});

  function updateInputValues(
    originalValues: inputState,
    newValue: inputState[0],
    keyOfInput: string
  ): inputState {
    const toReturn = { ...originalValues };
    toReturn[keyOfInput] = newValue;
    return toReturn;
  }

  const inputElements = inputFields.map((inputField, index) => {
    const keyOfInput = `${index}-input-field`;
    const nameOfInput = title.split(/\s/g).join("-");

    return (
      <div key={keyOfInput}>
        <label>
          {inputField.label}:
          <input
            type={inputField.type}
            placeholder={inputField.value ? `${inputField.value}` : ""}
            name={nameOfInput}
            onChange={(e) =>
              setInputValues((prev) =>
                updateInputValues(prev, e.target.value, inputField.label)
              )
            }
          />
        </label>
        <br />
      </div>
    );
  });

  return (
    <div className="backdrop">
    <dialog className="userModal" open>
      <h2>{title}</h2>
      {inputElements}
      <button onClick={() => submitHandler(id, inputValues)}>
        {title.toLowerCase()}
      </button>
      <button onClick={cancelHandler}>cancel</button>
    </dialog>
    </div>
  );
};

export default InputModal;

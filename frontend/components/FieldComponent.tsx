import React from "react";

interface FieldComponentProps {
  selectPosition: (position: string) => void;
}

const FieldComponent: React.FC<FieldComponentProps> = ({ selectPosition }) => {
  return (
    <>
      <div className="field-container">
        <div className="field">
          <div className="line center-line"></div>
          <div className="center-circle"></div>
          <div className="line center-circle-line"></div>

          <div className="penalty-area penalty-area-top"></div>
          <div className="penalty-area penalty-area-bottom"></div>

          <div className="position-row top">
            <div
              className="position-button"
              onClick={() => selectPosition("FWD")}
            >
              <div className="button-content">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="20"
                    height="20"
                    viewBox="0 0 17 16"
                  >
                    <path
                      fill="white"
                      fillRule="evenodd"
                      d="M.42 8.12L2.959 1.6l1.194.465 1.76 2.8 2.24-.614-.003-.008.883-.278 2.72 1.059-.09.024 1.825 2.637-1.848.71.624 1.623 2.242-.862 1.964 2.838-.803 2.064-1.812-.706-.29.745-1.5.66-.66-1.501.29-.745-4.427-1.724-.29.744-1.5.66-.66-1.5.29-.745-1.081-.42-.29.744-1.5.66-.66-1.501.29-.745z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="label">FWD</span>
              </div>
            </div>

            <div
              className="position-button"
              onClick={() => selectPosition("EX")}
            >
              <div className="button-content">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="20"
                    height="20"
                    viewBox="0 0 17 16"
                  >
                    <path
                      fill="white"
                      fillRule="evenodd"
                      d="M.42 8.12L2.959 1.6l1.194.465 1.76 2.8 2.24-.614-.003-.008.883-.278 2.72 1.059-.09.024 1.825 2.637-1.848.71.624 1.623 2.242-.862 1.964 2.838-.803 2.064-1.812-.706-.29.745-1.5.66-.66-1.501.29-.745-4.427-1.724-.29.744-1.5.66-.66-1.5.29-.745-1.081-.42-.29.744-1.5.66-.66-1.501.29-.745z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="label">SS</span>
              </div>
            </div>
          </div>

          <div className="position-row center">
            <div
              className="position-button"
              onClick={() => selectPosition("DEF")}
            >
              <div className="button-content">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="white"
                      fillRule="evenodd"
                      d="M7.428 7.13 2.426 2.13 0 3.999l2.347 2.4 1.386-1.012v6.019h8.534v-6.02L13.653 6.4 16 4l-2.427-1.872L8.57 7.13l-.571.57zm4.839 5.892H3.733v1.751h8.534zM7.999 5.416 3.716 1.134l.017-.014H6.08L8 3.04l1.92-1.92h2.347l.016.013z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="label">MID</span>
              </div>
            </div>

            <div
              className="position-button active"
              onClick={() => selectPosition("GK")}
            >
              <div className="button-content">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="white"
                      fillRule="evenodd"
                      d="M7.428 7.13 2.426 2.13 0 3.999l2.347 2.4 1.386-1.012v6.019h8.534v-6.02L13.653 6.4 16 4l-2.427-1.872L8.57 7.13l-.571.57zm4.839 5.892H3.733v1.751h8.534zM7.999 5.416 3.716 1.134l.017-.014H6.08L8 3.04l1.92-1.92h2.347l.016.013z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="label">MID</span>
              </div>
            </div>

            <div
              className="position-button"
              onClick={() => selectPosition("MID")}
            >
              <div className="button-content">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="white"
                      fillRule="evenodd"
                      d="M7.428 7.13 2.426 2.13 0 3.999l2.347 2.4 1.386-1.012v6.019h8.534v-6.02L13.653 6.4 16 4l-2.427-1.872L8.57 7.13l-.571.57zm4.839 5.892H3.733v1.751h8.534zM7.999 5.416 3.716 1.134l.017-.014H6.08L8 3.04l1.92-1.92h2.347l.016.013z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="label">MID</span>
              </div>
            </div>
          </div>

          <div className="position-row bottom">
            <div
              className="position-button"
              onClick={() => selectPosition("DEF")}
            >
              <div className="button-content">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="20"
                    height="20"
                    viewBox="0 0 16 17"
                  >
                    <path
                      fill="white"
                      d="M8.146 5.32 5.535 6.627v2.588c0 .904.468 1.745 1.237 2.22l1.374.85 1.373-.85a2.61 2.61 0 0 0 1.238-2.22V6.626z"
                    />
                    <path
                      fill="white"
                      fillRule="evenodd"
                      d="M14.238 3.912 8.146.866 2.053 3.912v5.592a6.31 6.31 0 0 0 2.991 5.367l3.102 1.918 3.1-1.918a6.31 6.31 0 0 0 2.992-5.367zM3.794 9.504V4.988l4.352-2.176 4.352 2.176v4.516a4.57 4.57 0 0 1-2.167 3.887l-2.185 1.351L5.96 13.39a4.57 4.57 0 0 1-2.166-3.886"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="label">DEF</span>
              </div>
            </div>

            <div
              className="position-button active"
              onClick={() => selectPosition("GK")}
            >
              <div className="button-content">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="20"
                    height="20"
                    viewBox="0 0 17 16"
                  >
                    <path
                      fill="white"
                      fillRule="evenodd"
                      d="M.42 8.12L2.959 1.6l1.194.465 1.76 2.8 2.24-.614-.003-.008.883-.278 2.72 1.059-.09.024 1.825 2.637-1.848.71.624 1.623 2.242-.862 1.964 2.838-.803 2.064-1.812-.706-.29.745-1.5.66-.66-1.501.29-.745-4.427-1.724-.29.744-1.5.66-.66-1.5.29-.745-1.081-.42-.29.744-1.5.66-.66-1.501.29-.745z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="label">GK</span>
              </div>
            </div>

            <div
              className="position-button"
              onClick={() => selectPosition("DEF")}
            >
              <div className="button-content">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="20"
                    height="20"
                    viewBox="0 0 16 17"
                  >
                    <path
                      fill="white"
                      d="M8.146 5.32 5.535 6.627v2.588c0 .904.468 1.745 1.237 2.22l1.374.85 1.373-.85a2.61 2.61 0 0 0 1.238-2.22V6.626z"
                    />
                    <path
                      fill="white"
                      fillRule="evenodd"
                      d="M14.238 3.912 8.146.866 2.053 3.912v5.592a6.31 6.31 0 0 0 2.991 5.367l3.102 1.918 3.1-1.918a6.31 6.31 0 0 0 2.992-5.367zM3.794 9.504V4.988l4.352-2.176 4.352 2.176v4.516a4.57 4.57 0 0 1-2.167 3.887l-2.185 1.351L5.96 13.39a4.57 4.57 0 0 1-2.166-3.886"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="label">DEF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FieldComponent;

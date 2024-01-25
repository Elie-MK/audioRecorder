import React, { useEffect, useRef, useState } from "react";
import ListOfRecordings from "./ListOfRecordings";

export default function AudioRecord() {
  const audioChunk = useRef([]);
  const [recordings, setRecordings] = useState([]);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [microphonePermissionState, setMicrophonePermissionState] = useState(
    "granted" | "prompt" | "denied"
  );
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const [counterId, setCounterId] = useState(1);
  const timerRef = useRef(timer);

  useEffect(() => {
    if (isRecording) {
        const intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          const newSeconds = (prevTimer.seconds + 1) % 60;
          const newMinutes =
            prevTimer.seconds === 59
              ? prevTimer.minutes + 1
              : prevTimer.minutes;
          return { minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
      return () => clearInterval(intervalId);
      }
  
    verifyMinute();
    setTimer((prevTimer) => {
      timerRef.current = prevTimer;
      return prevTimer;
    });
   
  }, [isRecording, timer]);

  
  navigator.permissions
    .query({ name: "microphone" })
    .then(function (queryResults) {
      setMicrophonePermissionState(queryResults.state);
      queryResults.onchange = function (onChangeResult) {
        if (onChangeResult.target) {
          setMicrophonePermissionState(onChangeResult.target.state);
        }
      };
    });

  const handleDeleteAudio = (id) => {
    const newRecordings = recordings.filter((index) => index.id !== id);
    setRecordings(newRecordings);
  };

  const handleClickStartRecord = async () => {
    try {
      setIsRecording(true);
      if (!isRecording) {
        setTimer({ minutes: 0, seconds: 0 });
        setCounterId(() => counterId + 1);
      }

      const dateStart = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunk.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunk.current, {
          type: "audio/webm;codecs=opus",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        const datasAudio = {
          id: counterId,
          link: audioUrl,
          timeStamp: dateStart,
          audio: audioBlob,
          length: timerRef,
          statusAudio: false,
        };

        setRecordings((prevRecs) => [...prevRecs, datasAudio]);
        stream.getTracks().map((track) => {
          track.stop();
        });

        audioChunk.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickStopRecord = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording" &&
        isRecording
      ) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyMinute = () => {
    if (timer.minutes >= 60) {
      setIsRecording(false);
      handleClickStopRecord();
    }
  };


  return (
    <div className="">
      <div className="flex flex-col gap-8 mt-10">
        <h1 className="text-4xl font-bold  text-gray-800">
          Senior Frontend Engineer Assignment Elie MULUMBA 
        </h1>

        <div>
          {microphonePermissionState === "granted" && (
            <div className="flex items-center gap-2 bg-green-800 w-fit rounded-full py-1 px-3 text-white">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5163 8.93451L11.0597 14.7023L8.0959 11.8984"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
              <p>Has microphone permission</p>
            </div>
          )}
          {microphonePermissionState === "prompt" && (
            <p>Does not have microphone permission yet</p>
          )}
          {microphonePermissionState === "denied" && (
            <div className="flex items-center gap-2 bg-red-800 w-fit rounded-full py-1 px-3 text-white">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.95206 16.048L16.0769 7.92297"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <path
                  d="M16.0914 16.0336L7.90884 7.85101"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
              <p>User declined permission</p>
            </div>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center justify-center gap-4 bg-green-800 w-fit rounded-full py-1 px-3 text-white">
            <p className="text-xl font-bold">
              {timer.minutes} : {timer.seconds}
            </p>
          </div>
        )}
        {!isRecording ? (
          <button
            type="button"
            className="w-56 rounded-md bg-red-600 px-2.5 py-1.5 text-sms font-semibold text-white shadow-sm hover:bg-red-500 "
            onClick={handleClickStartRecord}
          >
            Record
          </button>
        ) : (
          <button
            type="button"
            className="w-56 first:rounded-md bg-red-600 px-2.5 py-1.5 text-sms font-semibold text-white shadow-sm hover:bg-red-500 "
            onClick={handleClickStopRecord}
          >
            Stop
          </button>
        )}

        <h1 className="text-2xl">All Audios Recordings</h1>

        {recordings.map((item, index) => {
          return (
            <div key={index}>
              <div className="flex items-center gap-4">
                <p className="text-xl font-bold">{`#${item.id}`}</p>
                <audio controls src={item.link} />
                <div className="flex gap-5">
                  <div>
                    <a
                      className="flex gap-2"
                      href={item.link}
                      download={`recording-${index}.wav`}
                    >
                      <svg
                        width="35px"
                        height="35px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V12.1893L14.4697 10.4697C14.7626 10.1768 15.2374 10.1768 15.5303 10.4697C15.8232 10.7626 15.8232 11.2374 15.5303 11.5303L12.5303 14.5303C12.3897 14.671 12.1989 14.75 12 14.75C11.8011 14.75 11.6103 14.671 11.4697 14.5303L8.46967 11.5303C8.17678 11.2374 8.17678 10.7626 8.46967 10.4697C8.76256 10.1768 9.23744 10.1768 9.53033 10.4697L11.25 12.1893V7C11.25 6.58579 11.5858 6.25 12 6.25Z"
                          fill="#1C274C"
                        />
                        <path
                          d="M7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H16C16.4142 16.25 16.75 16.5858 16.75 17C16.75 17.4142 16.4142 17.75 16 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z"
                          fill="#1C274C"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.4137 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.4137 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25H11.9426ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62178 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z"
                          fill="#1C274C"
                        />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <button
                      className="flex gap-2"
                      onClick={() => handleDeleteAudio(item.id)}
                    >
                      <svg
                        width="35px"
                        height="35px"
                        viewBox="0 0 1024 1024"
                        className="icon"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z"
                          fill="red"
                        />
                        <path
                          d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z"
                          fill="red"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <ListOfRecordings datas={recordings} />
      </div>
    </div>
  );
}

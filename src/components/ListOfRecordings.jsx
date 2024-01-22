import { useEffect, useState } from "react";

export default function ListOfRecordings({ datas }) {
  const [isResponse, setIsResponse] = useState({});

  useEffect(() => {
  }, [isResponse]);

  // handle upload audio
  const uploadAudio = async (dataItem) => {
    try {
      const formData = new FormData();
      formData.append("audio", dataItem?.audio, "audio.wav");
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setIsResponse(data);
        dataItem.statusAudio = true;

        console.log("Audio file sent successfully.");
      } else {
        console.error("Error sending audio file.");
      }
    } catch (error) {
      console.error("Error sending audio file.", error);
    }
  };
  // console.log(isTrue);

  return (
    <div>
      <div>
        <table className="border-collapse border divide-y divide-dashed  border-spacing-x-12 border-spacing-5	 ">
          <thead>
            <tr>
              <th className="border p-4 bg-slate-700 text-white">Names</th>
              <th className="border p-4 bg-slate-700 text-white">Timestamp</th>
              <th className="border p-4 bg-slate-700 text-white">Length</th>
              <th className="border p-4 bg-slate-700 text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {datas?.map((item) => (
              <tr key={item.id}>
                <td className="border p-4">{`Session #${item?.id}`}</td>
                <td className="border p-4">{item?.timeStamp}</td>
                <td className="border p-4">
                  {`${item?.length.minutes} min : ${item?.length.seconds} sec`}{" "}
                </td>
                <td
                  className={`border p-4 ${
                    item?.statusAudio
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  <button
                    onClick={() => uploadAudio(item)}
                    disabled={item?.statusAudio}
                  >
                    {item?.statusAudio ? "Done" : "Click here to upload "}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

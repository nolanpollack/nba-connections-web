import Arrow from "@/app/components/Arrow";

interface Props {
    playerName?: string;
    teamName: string;
}

export default function ConnectionBox({ playerName, teamName }: Props) {
    return (
        <>
            <div className="flex items-center">
                <Arrow />
                <h2 className="text-stone-200 text-lg ml-2 font-bold">
                    {teamName}
                </h2>
            </div>
            {playerName && (
                <h2 className="text-white text-lg px-4 py-2">{playerName}</h2>
            )}
        </>
    );
}

// async function fetchConnectionResponse(p1: string, p2: string) {
//     const params = new URLSearchParams({p1, p2});
//     const url = "/api/find-connection?" + params;
//     return await fetch(url);
// }
//
// function PlayerInput({title, name, placeholder}: { title: string, name: string, placeholder?: string }) {
//     return (
//         <div className="mx-2 flex flex-col space-y-2">
//             <label className="text-white text-xl font-semibold">
//                 {title}
//             </label>
//             <input className=" px-4 py-2 text-white text-2xl rounded-md shadow-md bg-stone-900" name={name} type="text"
//                    placeholder={placeholder}/>
//         </div>
//     );
// }
//
// function ConnectionItem({team, year, player}: { team?: string, year?: string, player: string }) {
//     return (
//         <div className="flex flex-col items-center">
//             <div className="inline-flex w-full items-center justify-center">
//                 <hr className="h-px bg-stone-400/70 border-0 my-8 w-3/4"/>
//                 <span className="absolute text-stone-400/70 mx-4 text-lg bg-stone-800 px-2">played with</span>
//             </div>
//             <div className="text-white text-3xl flex space-x-2">
//                 <p>{player}</p>
//                 <p> on the {year}</p>
//                 <p>{team}</p>
//             </div>
//         </div>
//     );
// }
//
// export default function ConnectionBox() {
//     const [data, setData] = useState<ConnectionsResponseData[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [firstPlayer, setFirstPlayer] = useState<string>("");
//
//     async function handleSubmit(formData: FormData) {
//         if (loading) {
//             return;
//         }
//
//         const p1 = formData.get("p1");
//         const p2 = formData.get("p2");
//         if (!p1 || !p2) {
//             return;
//         }
//
//         setLoading(true);
//         setData([])
//         setFirstPlayer(p1.toString());
//         setTimeout(async () => {
//             try {
//                 const response = await fetchConnectionResponse(p1.toString(), p2.toString());
//
//                 if (response.status === 200) {
//                     const data = await response.json();
//                     const connections = data.map((item: any) => new ConnectionsResponseData(item[0], item[1], item[2]));
//                     setData(connections);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         }, 0);
//     }
//
//     return (
//         <div className={"dark:bg-stone-800 rounded-md grow flex flex-col h-full justify-start px-8 py-14 space-y-9"}>
//             <div className="w-full">
//                 <form action={handleSubmit} className={"flex justify-around items-end"}>
//                     <PlayerInput title="First Player" name="p1" placeholder="Michael Jordan"/>
//                     <label>
//                         <button
//                             className='transition ring-2 ring-stone-500/50 hover:scale-105 bg-red-900 text-xl dark:text-white text-stone-950 px-5 py-3 rounded-xl shadow-lg'
//                             type="submit"
//                             disabled={loading}>
//                             Submit
//                         </button>
//                     </label>
//                     <PlayerInput title="Second Player" name="p2" placeholder="LeBron James"/>
//                 </form>
//             </div>
//             {loading && <div className="text-white">Loading...</div>}
//             {data && data.length > 0 && <div className="flex flex-col items-center">
//                 <p className="rounded-md text-white text-3xl flex space-x-2">{firstPlayer}</p>
//                 {data.map((item, index) => (
//                     <ConnectionItem key={index} team={item.team} year={item.year} player={item.player}/>
//                 ))}
//             </div>}
//         </div>
//     )
// }

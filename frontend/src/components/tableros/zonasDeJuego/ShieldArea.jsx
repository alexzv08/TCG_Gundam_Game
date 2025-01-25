
const ShieldArea = () => {
    return (
        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
            <div className="flex justify-between w-full gap-4 ">
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-lg font-bold">Shields</h2>
                    <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                        <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl text-white ">{/*shieldArea.length*/}</div>
                        <div>
                            
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2" >
                    <h2 className="text-lg font-bold">Base</h2>
                    <div className="w-24 h-32 border border-gray-500 border-dashed">
                        
                    </div>
                </div>
            </div>
        </div>
    )
    };
    
    export default ShieldArea;
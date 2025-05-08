import PropTypes from 'prop-types';

export default function ShieldArea({ shields, baseArea = [] }) {
    return (
        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
            <div className="flex justify-between w-full gap-4 ">
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-lg font-bold">Shields</h2>
                    <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                        <div className="absolute inset-0 bottom-0 z-10 flex items-center justify-center w-10 h-10 text-3xl bg-red-500 top-full text-red">{shields.length}</div>
                        <div>
                            {shields.length > 0 && (
                                <div  className="absolute w-24 h-32 group" >
                                <div className='absolute w-24 top-[-20px] flex justify-center gap-2 opacity-0 group-hover:opacity-100'>
                                    <button className='w-8 h-8 bg-white rounded-xl' ><img src="{}" alt="play" className=''/></button>  {/*Enviar a la basura*/}
                                    <button className='w-8 h-8 bg-white rounded-xl' ><img src="{}" alt="discart" className=''/></button>  {/* Enviar a la mano */}
                                </div>
                                <img
                                    key="shield"
                                    src={`/imgCards/R-001.webp`}
                                    alt="Dorso carta"
                                    className="w-full h-auto"
                                />
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2" >
                    <h2 className="text-lg font-bold">Base</h2>
                    <div className="w-24 h-32 border border-gray-500 border-dashed">
                        {baseArea.map((carta, index) => (
                            <div key={`${carta.id_carta}-${index}`} className="absolute w-24 h-32 group" >
                                <div className='absolute w-24 top-[-20px] flex justify-center gap-2 opacity-0 group-hover:opacity-100'>
                                    <button className='w-8 h-8 bg-white rounded-xl' ><img src="{}" alt="play" className=''/></button>  {/*Enviar a la basura*/}
                                    <button className='w-8 h-8 bg-white rounded-xl' ><img src="{}" alt="discart" className=''/></button>  {/* Enviar a la mano */}
                                </div>
                                <img src={`/imgCards/${carta.id_coleccion}-${carta.id_carta}.webp`}  alt={`Carta ${carta.card_name}`} className="w-full h-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

ShieldArea.propTypes = {
    shields: PropTypes.array,
    baseArea: PropTypes.array,
};

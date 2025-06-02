// import LoginForm from '../organisms/loginForm/LoginForm';  // Importamos el componente FiltroCartas';
import ImgPrueba from '../../public/imgCards/GD01-070.webp'; // Importamos la imagen de prueba
const Pruebas = () => {
return (
    <div className="w-[140px] h-[137px] rounded-lg mx-auto my-20 relative shadow-lg shadow-black/50">
        <div
            className="w-full h-full bg-cover rounded-lg"
            style={{ backgroundImage: `url(https://d1n2ba7uw8bkm1.cloudfront.net/gcg/ST01_TMP/ST01-002.jpg)` }}
        ></div>
        <div
            className="absolute bottom-0 w-full h-6 bg-bottom bg-cover rounded-lg"
            style={{ backgroundImage: `url(https://d1n2ba7uw8bkm1.cloudfront.net/gcg/ST01_TMP/ST01-002.jpg)` }}
        ></div>

        <div className="absolute bg-[position:95%_100%] w-[30px] h-[30px] bg-[length:500%_auto] rounded-lg top-[-10px] left-[-10px] border-orange-400 border-2"
            style={{ backgroundImage: `url(https://d1n2ba7uw8bkm1.cloudfront.net/gcg/ST04_TMP/ST04-010.jpg)` }}>
        </div>
    </div>
    );
};

export default Pruebas;
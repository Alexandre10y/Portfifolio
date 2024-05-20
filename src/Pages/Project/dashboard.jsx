import './style.css'
function Dashboard() {
    return (
        <>
            <iframe title="AnaliseDeVendas-V1.0" 
            className='w-100 height-100' 
            src="https://app.powerbi.com/view?r=eyJrIjoiNDVjMTIxMDctNWI5OS00NWZlLTgxYzctZTM0N2ZmMmViYjZhIiwidCI6IjBiYWIxNGQ4LTEyNTktNDQyYi05MDQ0LTk2NjU4MWRjOWM2MyJ9" 
            frameborder="0" 
            allowFullScreen="true">
            </iframe>            
        </>
    );
}
export default Dashboard;
import'./Navbar.css';
/*create function and in side of the funtion create variables and assign value to the variables*/
function Navbar(){
    const name = "STEM";
    const itemCount = 0 ;
/*Retur the values*/
    return(
        /*create navigation bar*/
        <nav className='navbar'>
            {/*Name section*/}
            <div className='navbar-left'>
             <a href='#' className='brand'>Mebius</a>    
            </div>
               {/*navigation links section*/}
               <div className='navbar-links'>  
                 <a href='#'>Home</a>
                 <a href='#'>Shop</a>
               </div>

               <div className='navbar-right'>
                   <span> {itemCount} </span>
                   <a href='#' className='cart'>Cart</a>
                   <span>Hi {name} </span>
               </div>

        </nav>
    );


}


export default Navbar;
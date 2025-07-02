import './SideBar.css'

const navItems = [
    {text: 'Learn', icon: '', path: ''},
    {text: 'Breadex', icon: '', path: ''},
    {text: 'Bakery', icon: '', path: ''},
    {text: 'Profile', icon: '', path: ''}
];

function NavItems(){
    return (
        <div>item</div>
    );
}

function SideBar(){
    return (
        <nav id="sideBar">
            <div id="logoContainer">
                <div><img src="https://placehold.co/65x65" /></div>
                <div style={{fontSize: '1.2rem', letterSpacing: '2px'}}>BAKE-A<br></br>BOARD</div>
            </div>
            <aside>
                {navItems.map((item, index) => (
                    <a key={index} class="navItems" href={item.path}>
                        <div><img src="https://placehold.co/24x24"/></div>
                        <div>{item.text}</div>
                    </a>
                ))}
            </aside>
            <div>
                <a id="setting">
                    <div><img src="https://placehold.co/24x24"/></div>
                    <div>Settings</div>
                </a>
            </div>
        </nav>
    );
}

export default SideBar
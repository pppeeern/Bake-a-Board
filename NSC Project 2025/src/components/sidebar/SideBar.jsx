import './SideBar.css'

const navItems = [
    {text: 'Learn', icon: '', path: '/'},
    {text: 'Breadex', icon: '', path: '/breadex/'},
    {text: 'Bakery', icon: '', path: '/bakery/'},
    {text: 'Profile', icon: '', path: '/profile/'}
];

function SideBar(){
    return (
        <nav id="sideBar">
            <div id="logoContainer" onClick={() => location.href = '/'}>
                <div><img src="https://placehold.co/65x65" /></div>
                <div className='bake-a-board'>BAKE-A<br></br>BOARD</div>
            </div>
            <aside>
                {navItems.map((item, index) => (
                    <a
                        key = {index}
                        className = 'navItems'
                        href = {item.path}
                        title = {item.text}
                    >
                        <div><img src="https://placehold.co/24x24"/></div>
                        <div>{item.text}</div>
                    </a>
                ))}
            </aside>
            <div>
                <a id="setting" className='navItems' title='Settings'>
                    <div><img src="https://placehold.co/24x24"/></div>
                    <div>Settings</div>
                </a>
            </div>
        </nav>
    );
}

export default SideBar
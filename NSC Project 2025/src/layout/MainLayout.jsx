import Content from "../components/content/Content"
import SideBar from "../components/sidebar/SideBar"
import "./MainLayout.css"

function MainLayout(){
    return(
        <section id="mainLayout">
            <SideBar></SideBar>
            <Content></Content>
        </section>
    );
}

export default MainLayout
import { Link } from 'react-router-dom';
import './BreadexCard.css';

function BreadexCard({ content }) {
  return (
    <Link to={ `/breadex/info` } className='breadex_item' title={content.text}>
        <div className='breadex_item_img'></div>
        <div className='breadex_item_des'>
            <div className='breadex_item_des_title'>{content.text}</div>
            <div className='breadex_item_des_save'>...</div>
        </div>
    </Link>
  );
}

export default BreadexCard
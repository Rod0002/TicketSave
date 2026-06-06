import { Link } from 'react-router-dom';
import { FaHeadset } from 'react-icons/fa';

const produtos = [
  { nome: 'iPhone 11', preco: 'R$ 3.499', img: 'https://revendeletro.com.br/wp-content/uploads/2020/02/iphone-11-01.jpg' },
  { nome: 'iPhone 12', preco: 'R$ 4.299', img: 'https://m.media-amazon.com/images/I/71fVoqRC0wL._AC_SX679_.jpg' },
  { nome: 'Samsung S24', preco: 'R$ 4.999', img: 'https://shopq1.assurancewireless.com/wp-content/uploads/2024/10/Samsung_Galaxy_S24_Black_front-500x500.png' },
  { nome: 'iPhone 13', preco: 'R$ 4.799', img: 'https://m.media-amazon.com/images/I/61-r9zOKBCL._AC_SX679_.jpg' },
  { nome: 'Motorola Edge 50 Pro', preco: 'R$ 3.299', img: 'https://planoscelular.claro.com.br/medias/515Wx515H-productMain-18923-zero.png?context=bWFzdGVyfGltYWdlc3wyMjkzMzB8aW1hZ2UvcG5nfGFHUTNMMmd5TVM4eE1ESXdNVEExTmpFeE5qYzJOaTgxTVRWWGVEVXhOVWhmY0hKdlpIVmpkRTFoYVc1Zk1UZzVNak5mZW1WeWJ5NXdibWN8NzI1YTM3NTZkYWRiMDVjNTFlN2E4YWIzYmFlYmQ5ZTI5Zjc5MjI2ZDU5Y2Q4YjgyZjFlMjVjMDY1NGNlNGZjNg' },
  { nome: 'Xiaomi 14', preco: 'R$ 5.499', img: 'https://www.havan.com.br/media/catalog/product/c/e/celular-smartphone-xiaomi-redmi-14c-4g-4gb-ram-256gb_1054623.jpg' },
  { nome: 'iPhone 15', preco: 'R$ 6.599', img: 'https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_SX679_.jpg' },
  { nome: 'Samsung Galaxy A54', preco: 'R$ 1.799', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_878188-MLA99917504809_112025-F.webp' },
  { nome: 'Motorola Moto G84', preco: 'R$ 1.499', img: 'https://brmotorolanew.vtexassets.com/arquivos/ids/171552/frente-smartphone-moto-g84-viva-magenta-vegan-leather-1.png?v=638798013726400000' },
  { nome: 'Xiaomi Poco X6', preco: 'R$ 2.199', img: 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/544052/Smartphone-Xiaomi-Poco-X6-256GB-12GB-RAM-Qualcomm-Snapdragon-7s-Com-Nfc-Preto_1712078888_gg.jpg' },
  { nome: 'Samsung Galaxy S23 FE', preco: 'R$ 2.999', img: 'https://http2.mlstatic.com/D_NQ_NP_973767-MLA99970194685_112025-O.webp' },
  { nome: 'Xiaomi Redmi Note 13', preco: 'R$ 1.299', img: 'https://i02.appmifile.com/476_item_sg/22/10/2024/a8ebadd2d31d601536a7916be5f779b9.png' }
];

function ProdutosPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Produtos</h1>
          <p className="page-subtitle">Confira nossos smartphones disponíveis para suporte</p>
        </div>
        <Link to="/ajuda" className="btn-primary">
          <FaHeadset /> Preciso de Ajuda
        </Link>
      </div>

      <div className="products-grid-modern">
        {produtos.map((p, i) => (
          <div key={i} className="product-card-modern">
            <div className="product-img-wrap">
              <img 
                src={p.img} 
                alt={p.nome} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/200?text=Sem+Imagem';
                }}
              />
            </div>
            <div className="product-details">
              <h3>{p.nome}</h3>
              <p className="product-price">{p.preco}</p>
              <div className="product-actions">
                <Link to="/ajuda" className="btn-primary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                  Solicitar Suporte
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProdutosPage;
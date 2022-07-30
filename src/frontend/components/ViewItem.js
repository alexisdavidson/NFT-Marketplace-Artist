import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import {useLocation} from 'react-router-dom';

const ViewItem = ({ marketplace, nft }) => {
    const location = useLocation();

    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState([])
    const loadMarketplaceItem = async () => {
        console.log("Looking for item " + location.state.itemId)

        // Load all unsold items
        const itemCount = await marketplace.itemCount()
        for (let i = 1; i <= itemCount; i++) {
            const item = await marketplace.items(i)
            console.log("item " + item.tokenId)
            if (item.tokenId == location.state.itemId) {
                // get uri url from nft contract
                const uri = await nft.tokenURI(item.tokenId)
                // use uri to fetch the nft metadata stored on ipfs 
                const response = await fetch(uri)
                const metadata = await response.json()
                // get total price of item (item price + fee)
                const totalPrice = await marketplace.getTotalPrice(item.itemId)
                setItem({
                    totalPrice,
                    itemId: item.itemId,
                    seller: item.seller,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                })
                setLoading(false)
            }
        }
    }

    const buyMarketItem = async (item) => {
        await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
        loadMarketplaceItem()
    }

    useEffect(() => {
        loadMarketplaceItem()
    }, [])

    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
        <h2>Loading item...</h2>
        </main>
    )

    return (
        <div className="flex justify-center">
            {item != null ?
                <div className="px-5 container">
                    <h2>{location.state.itemId} {item.name}</h2>
                    <Row xs={1} md={2} lg={4} className="g-4 py-5">
                        <Col className="overflow-hidden">
                            <Card>
                                <Card.Img variant="top" src={item.image} />
                                <Card.Body color="secondary">
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    {item.description}
                                </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                <div className='d-grid'>
                                    <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                                    </Button>
                                </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
            : (
                <main style={{ padding: "1rem 0" }}>
                    <h2>Asset not found</h2>
                </main>
            )}
        </div>
    );
}
export default ViewItem
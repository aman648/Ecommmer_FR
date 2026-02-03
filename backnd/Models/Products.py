class Products:
    product_id: int
    name: str
    description: str
    price: float
    stock: int
    is_acrive: bool = None
    def __init__(self, product_id, name, description, price, stock):
        self.product_id = product_id
        self.name = name
        self.description = description
        self.price = price
        self.stock = stock
        self.is_active = True

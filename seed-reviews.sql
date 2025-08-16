-- Insert mock review data for different products
INSERT INTO product_reviews (product_id, rating, title, comment, pros, cons, customer_name, avatar, verified, helpful_count) VALUES

-- Reviews for Fresh Organic Tomatoes (prod_01J4PJRHQRR7B8VQE5N1QKV8JM)
('prod_01J4PJRHQRR7B8VQE5N1QKV8JM', 5, 'Absolutely fresh and delicious!', 'These tomatoes are incredibly fresh and taste amazing. Perfect for salads and cooking. Will definitely order again!', 'Very fresh, great taste, quick delivery', 'None that I can think of', 'Sarah Johnson', 'https://i.pravatar.cc/150?img=1', true, 12),
('prod_01J4PJRHQRR7B8VQE5N1QKV8JM', 4, 'Good quality tomatoes', 'Nice tomatoes, though a bit pricey. Quality is definitely there and they lasted longer than store-bought ones.', 'Great quality, long-lasting freshness', 'Slightly expensive', 'Mike Chen', 'https://i.pravatar.cc/150?img=2', true, 8),
('prod_01J4PJRHQRR7B8VQE5N1QKV8JM', 5, 'Best tomatoes I''ve had!', 'Simply the best tomatoes I''ve purchased online. The flavor is outstanding and they arrived in perfect condition.', 'Exceptional flavor, perfect packaging', '', 'Emily Rodriguez', 'https://i.pravatar.cc/150?img=3', true, 15),

-- Reviews for Premium Grass-Fed Beef (prod_01J4PJRWGV2B7X9N8K3MQ4L6HP)
('prod_01J4PJRWGV2B7X9N8K3MQ4L6HP', 5, 'Outstanding beef quality', 'This grass-fed beef is absolutely incredible. You can taste the difference in quality immediately. Perfect marbling and tenderness.', 'Superior taste, excellent marbling, ethical sourcing', 'Premium price point', 'David Wilson', 'https://i.pravatar.cc/150?img=4', true, 18),
('prod_01J4PJRWGV2B7X9N8K3MQ4L6HP', 4, 'Very good, but expensive', 'Really good beef, much better than regular grocery store meat. The price is quite high but you do get what you pay for.', 'Great quality, noticeable difference in taste', 'Expensive', 'Lisa Thompson', 'https://i.pravatar.cc/150?img=5', true, 7),
('prod_01J4PJRWGV2B7X9N8K3MQ4L6HP', 5, 'Worth every penny!', 'I''ve been buying this beef for months now. Consistently excellent quality, and I love supporting sustainable farming practices.', 'Consistent quality, sustainable farming, excellent taste', '', 'Robert Martinez', 'https://i.pravatar.cc/150?img=6', true, 22),

-- Reviews for Artisan Sourdough Bread (prod_01J4PJSGTC5N9P2Q1R8K7M4X3W)
('prod_01J4PJSGTC5N9P2Q1R8K7M4X3W', 4, 'Delicious artisan bread', 'Really good sourdough with a perfect crust and soft interior. Arrived fresh and well-packaged.', 'Great taste, perfect texture, fresh arrival', 'Could use more tangy flavor', 'Jennifer Lee', 'https://i.pravatar.cc/150?img=7', true, 9),
('prod_01J4PJSGTC5N9P2Q1R8K7M4X3W', 5, 'Best sourdough ever!', 'This is hands down the best sourdough bread I''ve ever had. The crust is perfect and the flavor is incredible.', 'Amazing flavor, perfect crust, authentic sourdough', '', 'Mark Anderson', 'https://i.pravatar.cc/150?img=8', true, 14),
('prod_01J4PJSGTC5N9P2Q1R8K7M4X3W', 3, 'Good but arrived a bit stale', 'The bread itself is good quality, but it arrived a day late and was starting to get stale. Packaging could be improved.', 'Good flavor when fresh', 'Delivery issues, packaging needs improvement', 'Amanda Brown', 'https://i.pravatar.cc/150?img=9', false, 3),

-- Reviews for Free-Range Eggs (prod_01J4PJSHV4K8L9M2N5P7Q1R3T6)
('prod_01J4PJSHV4K8L9M2N5P7Q1R3T6', 5, 'Golden yolks and amazing taste', 'These eggs have the most beautiful golden yolks I''ve ever seen. The taste is so much richer than store-bought eggs.', 'Rich flavor, beautiful golden yolks, fresh', '', 'Carol Davis', 'https://i.pravatar.cc/150?img=10', true, 11),
('prod_01J4PJSHV4K8L9M2N5P7Q1R3T6', 4, 'Great eggs, well packaged', 'Really good quality eggs. They were packaged very well and all arrived intact. Will order again.', 'Excellent packaging, great quality', 'Slightly pricey', 'Paul Garcia', 'https://i.pravatar.cc/150?img=11', true, 6),

-- Reviews for Organic Honey (prod_01J4PJSRM8N1P4Q7R9S2T5U8V3)
('prod_01J4PJSRM8N1P4Q7R9S2T5U8V3', 5, 'Pure liquid gold!', 'This honey is absolutely divine. You can taste the purity and quality. Perfect for tea, toast, or just eating by the spoonful!', 'Pure taste, excellent quality, versatile use', '', 'Helen White', 'https://i.pravatar.cc/150?img=12', true, 16),
('prod_01J4PJSRM8N1P4Q7R9S2T5U8V3', 4, 'Very good honey', 'Nice honey with good flavor. The jar is a good size and the honey is definitely high quality.', 'Good flavor, nice jar size', 'Could be a bit more floral', 'James Taylor', 'https://i.pravatar.cc/150?img=13', true, 5),

-- Reviews for Seasonal Mixed Vegetables (prod_01J4PJSVX6Y9Z2A5B8C1D4E7F0)
('prod_01J4PJSVX6Y9Z2A5B8C1D4E7F0', 4, 'Fresh seasonal mix', 'Great variety of seasonal vegetables, all very fresh. Perfect for making a hearty soup or stir-fry.', 'Great variety, very fresh, good value', 'Some vegetables were smaller than expected', 'Susan Miller', 'https://i.pravatar.cc/150?img=14', true, 8),
('prod_01J4PJSVX6Y9Z2A5B8C1D4E7F0', 5, 'Love the variety!', 'This mix introduced me to vegetables I''ve never tried before. Everything was fresh and delicious. Great way to eat seasonally!', 'Exciting variety, all fresh, educational', '', 'Kevin Moore', 'https://i.pravatar.cc/150?img=15', true, 13);

// 🔍 CUSTOMER DATA DEBUG HELPER
// Copy-paste this in Browser Console after login as customer

console.log('=== CUSTOMER DATA DEBUG ===\n');

// 1. Check localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('1. User from localStorage:');
console.log('   ID:', user.id);
console.log('   Username:', user.username);
console.log('   Role:', user.role);
console.log('   Expected: U-PELANGGAN-001, testing, pelanggan\n');

// 2. Test API call
console.log('2. Testing API /orders...');
fetch('http://localhost:3002/api/orders', { 
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('   Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('   Orders Count:', data.length);
  console.log('   Orders:', data);
  
  if (data.length > 0) {
    console.log('\n3. First Order Details:');
    const order = data[0];
    console.log('   ID:', order.id);
    console.log('   Created By:', order.createdBy);
    console.log('   Customer ID:', order.customerId);
    console.log('   Status:', order.status);
    console.log('   Has Items:', order.items?.length || 0);
    
    if (order.items && order.items.length > 0) {
      console.log('\n4. Items Structure:');
      console.log('   First Item:', order.items[0]);
      console.log('   Has serviceName:', !!order.items[0].serviceName);
    }
    
    console.log('\n✅ Data connection is working!');
  } else {
    console.log('\n❌ NO ORDERS FOUND!');
    console.log('   This means customer has no orders in database.');
    console.log('   Run: cd backend && node create-customer-orders.js');
  }
})
.catch(err => {
  console.log('\n❌ API ERROR:', err);
  console.log('   Check if backend is running on port 3002');
  console.log('   Check if you are logged in');
});

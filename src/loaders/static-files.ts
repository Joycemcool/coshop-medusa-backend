 const express = require('express')
const path = require('path')

module.exports = (container) => {
  const app = container.resolve('express')
  
  // Serve static files from uploads directory
  const uploadsPath = path.join(__dirname, '../../uploads')
  console.log('📁 Setting up static file serving for uploads at:', uploadsPath)
  
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: '1d', // Cache for 1 day
    etag: false
  }))
  
  console.log('✅ Static file serving configured for /uploads')
}

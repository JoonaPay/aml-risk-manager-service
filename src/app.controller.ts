import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome(@Res() res: Response) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JoonaPay AML Risk Manager</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #FFFFFF;
            color: #000000;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            padding: 20px 0;
            border-bottom: 1px solid #E5E5E5;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #000000;
        }
        
        .nav-links {
            display: flex;
            gap: 30px;
        }
        
        .nav-links a {
            color: #000000;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s;
        }
        
        .nav-links a:hover {
            opacity: 0.8;
        }
        
        .hero {
            text-align: center;
            padding: 80px 0;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding: 60px 0;
        }
        
        .feature-card {
            background: #FFFFFF;
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            border: 1px solid #E5E5E5;
            transition: transform 0.3s ease;
            color: #000000;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: #000000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
            color: white;
        }
        
        .feature-card h3 {
            font-size: 1.4rem;
            margin-bottom: 15px;
        }
        
        .feature-card p {
            color: #666666;
            line-height: 1.6;
        }
        
        .api-section {
            background: #FFFFFF;
            border-radius: 16px;
            padding: 40px;
            margin: 40px 0;
            color: #000000;
            border: 1px solid #E5E5E5;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .api-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .api-endpoint {
            background: #F8F8F8;
            border-radius: 8px;
            padding: 20px;
            border-left: 4px solid #000000;
            border: 1px solid #E5E5E5;
        }
        
        .api-endpoint h4 {
            margin-bottom: 10px;
            color: #000000;
        }
        
        .api-endpoint code {
            background: rgba(0, 0, 0, 0.3);
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        
        .status-section {
            text-align: center;
            padding: 40px 0;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .status-item {
            background: #FFFFFF;
            border-radius: 12px;
            padding: 25px;
            color: #000000;
            border: 1px solid #E5E5E5;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .status-value {
            font-size: 2rem;
            font-weight: bold;
            color: #000000;
            margin-bottom: 10px;
        }
        
        .btn {
            display: inline-block;
            background: #000000;
            color: #FFFFFF;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            margin: 10px;
        }
        
        .btn:hover {
            background: #333333;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #666666;
        }
        
        .btn-secondary:hover {
            background: #444444;
        }
        
        footer {
            text-align: center;
            padding: 40px 0;
            border-top: 1px solid #E5E5E5;
            margin-top: 60px;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav class="nav">
                <div class="logo">🛡️ JoonaPay AML</div>
                <div class="nav-links">
                    <a href="/api">API Docs</a>
                    <a href="/health">Health</a>
                    <a href="/metrics">Metrics</a>
                    <a href="/admin">Admin Panel</a>
                </div>
            </nav>
        </div>
    </header>

    <main>
        <div class="container">
            <section class="hero">
                <h1>AML Risk Manager</h1>
                <p>Advanced Anti-Money Laundering compliance and risk assessment platform with real-time screening, intelligent analytics, and comprehensive reporting capabilities.</p>
                <a href="/api" class="btn">Explore API</a>
                <a href="/admin" class="btn btn-secondary">Admin Dashboard</a>
            </section>

            <section class="features">
                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <h3>Sanctions Screening</h3>
                    <p>Real-time screening against global sanctions lists including OpenSanctions, OFAC, and other regulatory databases with intelligent matching algorithms.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Risk Assessment</h3>
                    <p>AI-powered risk scoring and assessment with customizable rules, geographic risk analysis, and PEP (Politically Exposed Person) screening.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Compliance Reporting</h3>
                    <p>Automated SAR/CTR report generation, regulatory filing management, and comprehensive audit trails for compliance documentation.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Event-Driven Architecture</h3>
                    <p>CQRS implementation with domain events for real-time monitoring, audit logging, and responsive compliance workflows.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🌐</div>
                    <h3>External Integrations</h3>
                    <p>Seamless integration with free and premium AML data sources, geographic risk APIs, and machine learning services.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3>Analytics & Insights</h3>
                    <p>Advanced analytics dashboard with risk trends, compliance metrics, investigation case management, and predictive insights.</p>
                </div>
            </section>

            <section class="api-section">
                <h2>🚀 API Endpoints</h2>
                <p>Comprehensive REST API for all AML compliance operations</p>
                
                <div class="api-grid">
                    <div class="api-endpoint">
                        <h4>Sanctions Screening</h4>
                        <code>POST /api/v1/compliance/screen/sanctions</code>
                        <p>Screen entities against global sanctions lists</p>
                    </div>
                    
                    <div class="api-endpoint">
                        <h4>PEP Screening</h4>
                        <code>POST /api/v1/compliance/screen/pep</code>
                        <p>Check for politically exposed persons</p>
                    </div>
                    
                    <div class="api-endpoint">
                        <h4>Risk Assessment</h4>
                        <code>POST /api/v1/compliance/assess/geographic-risk</code>
                        <p>Assess geographic and jurisdictional risks</p>
                    </div>
                    
                    <div class="api-endpoint">
                        <h4>Batch Screening</h4>
                        <code>POST /api/v1/compliance/screen/batch</code>
                        <p>Process multiple entities in batch</p>
                    </div>
                </div>
            </section>

            <section class="status-section">
                <h2>📊 System Status</h2>
                
                <div class="status-grid">
                    <div class="status-item">
                        <div class="status-value">✅</div>
                        <div>Service Status</div>
                    </div>
                    
                    <div class="status-item">
                        <div class="status-value">🔗</div>
                        <div>External APIs</div>
                    </div>
                    
                    <div class="status-item">
                        <div class="status-value">💾</div>
                        <div>Database</div>
                    </div>
                    
                    <div class="status-item">
                        <div class="status-value">⚡</div>
                        <div>Events System</div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 JoonaPay. Advanced AML Risk Management Platform. Built with NestJS & CQRS.</p>
        </div>
    </footer>

    <script>
        // Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Animate feature cards on scroll
            const cards = document.querySelectorAll('.feature-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });
            
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        });
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }


  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'AML Risk Manager Service',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}

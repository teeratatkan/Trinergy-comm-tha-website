const path = require('path');
const fs = require('fs');
const { getDb } = require('./db');

// Delete existing DB to force a fresh seed
const dbPath = path.join(__dirname, '..', 'trinergy.db');
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
// Also remove WAL/SHM files if present
[dbPath + '-wal', dbPath + '-shm'].forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });

function initDb() {
  const db = getDb();

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      short_description TEXT,
      description TEXT,
      tags TEXT,
      specs TEXT,
      image_path TEXT,
      theme TEXT DEFAULT 'default',
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS company_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS fiveg_specs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_key TEXT NOT NULL,
      spec_value TEXT NOT NULL,
      spec_group TEXT DEFAULT 'general',
      display_order INTEGER DEFAULT 0
    );
  `);

  // Seed products — always fresh (DB was deleted above)
  const insertProduct = db.prepare(`
    INSERT INTO products (name, category, short_description, description, tags, specs, display_order, theme)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    [
      'SEED-IOT Kit',
      'iot',
      'ESP32-based Smart Farm Basic Kit — learn IoT from circuit to crop.',
      'SEED-IOT Smart Farm Basic Kit is an entry-level IoT training kit designed for university students. Built around the ESP32 microcontroller and programmed with Arduino IDE, it teaches sensor integration, data acquisition, and cloud connectivity through hands-on smart farming experiments. Includes complete curriculum with lab exercises covering digital/analog I/O, DHT22, DS1820, Ultrasonic, LDR, DC/Stepping/Servo motors, Relay, OLED/LCD displays, RS-232/RS-485 conversion, and IoT protocols.',
      'Education, Beginner, Arduino, ESP32, Smart Farm',
      JSON.stringify({
        "MCU": "ESP32",
        "Programming IDE": "Arduino IDE",
        "Power Supply": "3.3V / 5V DC",
        "Displays": "OLED 128x64, LCD 16x2, 7-Segment",
        "Sensors": "DHT22 (Temp/Humidity), DS1820, LDR, Ultrasonic",
        "Actuators": "DC Motor, Stepping Motor, Servo Motor, Relay (SPDT)",
        "Communication": "RS-232, RS-485 (x2), I2C",
        "Extra MCUs": "Arduino Nano, Raspberry Pi Zero",
        "Connectivity": "Wi-Fi, MQTT Cloud",
        "Target": "University / Vocational"
      }),
      1,
      'blue',
    ],
    [
      'SEED-IOT-PRO',
      'iot',
      'Industrial Smart Farm Development Kit with ESP32-S3, Touch HMI, and Modbus RS485.',
      'SEED-IOT-PRO Smart Farm Development Kit is an advanced industrial IoT training platform. Features ESP32-S3 WROVER with PSRAM as the main controller, a 4.3" Touch Screen HMI, Modbus RS485 industrial communication, MQTT broker, and full web frontend/backend stack. Teaches full-stack IoT development: from sensor reading, industrial protocol communication, HMI display programming, to cloud dashboard. Includes soil sensors (N/P/K, moisture, pH), weather sensors, and structured practice exercises.',
      'Industrial, Advanced, ESP32-S3, Modbus, HMI, Smart Farm',
      JSON.stringify({
        "MCU": "ESP32-S3 WROVER (with PSRAM)",
        "Touch HMI": "4.3 inch Touch Screen",
        "Industrial Protocol": "Modbus RS485",
        "IoT Protocol": "MQTT Broker",
        "Soil Sensors": "N/P/K, Moisture, pH",
        "Weather Sensors": "Temperature, Humidity, Pressure",
        "Software Stack": "Web Frontend + Backend",
        "Communication": "Wi-Fi, RS485",
        "Target": "University / Industrial Training"
      }),
      2,
      'blue',
    ],
    [
      'IoT for Smart Farming',
      'iot',
      'Complete IoT Smart Farming system for greenhouse, field crops, aquaculture, and livestock.',
      'IoT for Smart Farming is a complete automation system covering multiple agriculture verticals: greenhouse, field crops, horticulture, fishery, and livestock. Built on ESP32 + Raspberry Pi edge computing, it supports Modbus RS485 industrial sensors, automated control of irrigation valves, fans, and pumps. Includes IoT Gateway board, Touch Screen HMI, surge protection, and a real-time dashboard platform. Teaches full IoT pipeline from sensor reading to cloud analytics.',
      'Agriculture, IoT Gateway, Automation, Modbus, ESP32',
      JSON.stringify({
        "Controller": "ESP32 + Raspberry Pi",
        "Gateway": "IoT Gateway Board",
        "Touch HMI": "4.3 inch Touch Screen",
        "Industrial Protocol": "Modbus RS485",
        "Soil Sensors": "N/P/K, Moisture, pH, EC",
        "Water Sensors": "Flow, Level",
        "Weather Sensors": "Temperature, Humidity, Wind, Rain",
        "Actuators": "Solenoid Valve, Fan, Pump, Relay",
        "Power": "24V DC with surge protection",
        "Target": "University / Smart Farm Research"
      }),
      3,
      'blue',
    ],
    [
      'Super Crops',
      'iot',
      'Professional Smart Farming system with 8-type sensors, edge AI, and real-time dashboard.',
      'Super Crops IoT-Pro is a professional smart farming training system designed for agricultural education and research. Features an 8-type sensor array including soil N/P/K, moisture, pH, CO₂, and PAR sensors. Uses ESP32-S3 for edge control and Raspberry Pi for edge ML/AI processing. Supports auto-irrigation via solenoid valves, multi-zone monitoring, and sends real-time LINE notifications. The dashboard displays live sensor data, historical trends, and automated alerts. Covers greenhouse, field crops, fishery, and livestock verticals.',
      'Agriculture, Edge AI, Smart Farm, 8 Sensors, LINE Alerts',
      JSON.stringify({
        "Controller": "ESP32-S3 + Raspberry Pi",
        "Soil Sensors": "N/P/K, Moisture, pH, CO₂, PAR (8 types)",
        "Water Sensors": "Flow, Level, pH, EC",
        "Weather Sensors": "Temperature, Humidity, Wind Speed, Rain",
        "Actuators": "Solenoid Valve, Fan, Pump",
        "Gateway": "IoT Gateway Board",
        "Touch HMI": "Touch Screen Display",
        "Power": "24V DC, surge protection, UPS-compatible",
        "Dashboard": "Real-time multi-zone + LINE alerts",
        "Edge AI": "Auto-irrigation ML model"
      }),
      4,
      'blue',
    ],
    [
      'Lab IoT (MCU Training Kit)',
      'iot',
      'Comprehensive MCU & IoT training board with Arduino Nano, ESP32, and Raspberry Pi Zero.',
      'The Lab IoT MCU Training Kit is a comprehensive electronics and IoT training platform featuring three microcontrollers: Arduino Nano, ESP32, and Raspberry Pi Zero 2. The board includes an extensive set of components and sensors for hands-on laboratory exercises covering digital/analog I/O, display interfaces, communication protocols, motor control, and IoT connectivity. Comes with a complete structured curriculum covering 20+ practical lab exercises from basic GPIO to cloud IoT integration.',
      'Education, MCU, Arduino, ESP32, Raspberry Pi, Lab',
      JSON.stringify({
        "MCUs": "Arduino Nano, ESP32, Raspberry Pi Zero 2",
        "Power": "3.3V / 5V DC",
        "LEDs": "4x Status LED",
        "Displays": "OLED 128x64, LCD 16x2, 7-Segment (3-digit)",
        "Sensors": "DHT22, DS1820, Thermistor NTC, LDR, Ultrasonic, RTC",
        "Buttons": "4x Push Button, 4x3 Keypad Matrix",
        "Actuators": "DC Motor, Stepping Motor, Servo Motor, 2x Relay SPDT, Buzzer",
        "Communication": "RS-232, RS-485 (x2), I2C",
        "Breadboard": "400-point breadboard included",
        "Lab Exercises": "20+ structured labs"
      }),
      5,
      'blue',
    ],
    [
      'UData Platform',
      'ai',
      'Multi-protocol IoT data platform for Digital University — MQTT, Modbus, OPC-UA, BACnet.',
      'UData Platform is Trinergy\'s enterprise IoT data management platform designed for Digital Universities and smart facilities. Built on Thingsboard backbone with Trinergy customizations, it connects all IoT devices — energy meters, smart farm sensors, weather stations, CCTV, water management systems — into a single real-time dashboard. Supports multi-protocol connectivity (MQTT, Modbus, OPC-UA, BACnet), automated alerts via LINE/email, data export for ML/AI analysis, and full API integration for third-party systems.',
      'Platform, IoT, Multi-Protocol, Big Data, Digital University',
      JSON.stringify({
        "Base Platform": "Thingsboard (customized by Trinergy)",
        "Protocols": "MQTT, Modbus, OPC-UA, BACnet",
        "Features": "Real-time dashboard, Automation, Alerts",
        "Integrations": "Energy Management, Smart Farm, Weather Station, CCTV, Water Management",
        "Alerts": "LINE notify, Email, SMS",
        "Data Export": "CSV, API, JSON",
        "Deployment": "Local Server or Cloud",
        "AI Support": "ML/AI data pipeline, CSV export for training",
        "Target": "University, Industrial, Smart Building"
      }),
      6,
      'purple',
    ],
    [
      'AI Lab Kit',
      'ai',
      'Complete AI laboratory with 3 hardware tiers — 8 topics, 19 hands-on labs.',
      'AI Lab Kit is a complete artificial intelligence laboratory solution offered in three hardware tiers to fit any budget. The curriculum covers 8 major AI topics across 19 practical lab exercises: Python for AI, Machine Learning with scikit-learn, Computer Vision & CNN with OpenCV, Natural Language Processing with BERT/spaCy (including Thai NLP), Face Detection, Generative AI & LLMs, and Real-world AI deployment. Hardware tiers: Tier A Premium (Apple M4 iMac 24GB for research-level work), Tier B Standard (AI Computer with RTX 2060 CUDA), Tier C Essential (Raspberry Pi 5 for embedded AI).',
      'AI, Machine Learning, Computer Vision, NLP, Education',
      JSON.stringify({
        "Tier A (Premium)": "Apple M4 iMac 24GB — MLX framework, LLM fine-tune",
        "Tier B (Standard)": "AI Computer RTX 2060 — CUDA, PyTorch, TensorFlow",
        "Tier C (Essential)": "Raspberry Pi 5 — Edge AI, TensorFlow Lite",
        "Topics": "8 topics",
        "Lab Exercises": "19 practical labs",
        "Languages": "Python",
        "Libraries": "scikit-learn, OpenCV, PyTorch, TensorFlow, BERT, spaCy",
        "AI Topics": "Python, ML, CV/CNN, NLP, Face Detection, Generative AI",
        "Thai AI": "Thai NLP datasets included",
        "Curriculum": "Complete with trainer on-site"
      }),
      7,
      'purple',
    ],
    [
      'GEN TRI — Sovereign AI',
      'ai',
      'Sovereign Thai LLM with RAG — runs on-premise, data never leaves your organization.',
      'GEN TRI is Trinergy\'s sovereign AI solution: a locally-deployed Large Language Model fine-tuned for the Thai language. Runs entirely on your university or enterprise server — no data ever leaves the premises. Built on open-weight LLM foundations (8B/13B/70B parameters), GEN TRI includes a RAG (Retrieval-Augmented Generation) pipeline connected to your organization\'s knowledge base (thesis documents, regulations, curriculum). Features Thai instruction fine-tuning, cultural context understanding, source citations, and a clean Chat/API/SSO interface.',
      'Sovereign AI, Thai LLM, RAG, On-Premise, Privacy',
      JSON.stringify({
        "Model Size": "8B / 13B / 70B parameters (selectable)",
        "Architecture": "Open-weight LLM with Thai instruction fine-tuning",
        "RAG": "Vector DB + Embedding (Thai-optimized)",
        "Knowledge Base": "Thesis, documents, regulations, curriculum",
        "Language": "Thai + English",
        "Interface": "Chat UI, REST API, SSO integration",
        "Deployment": "On-premise server (no cloud required)",
        "Privacy": "Data never leaves your server",
        "Citations": "Every answer includes source references",
        "Target": "University, Enterprise, Government"
      }),
      8,
      'purple',
    ],
    [
      'OAIBOX™',
      '5g',
      'Plug-and-play 5G education platform based on OpenAirInterface with real O-RAN support.',
      'OAIBOX™ is a plug-and-play 5G research and education platform built on OpenAirInterface (OAI). Available in three variants: OAIBOX 40 (SISO, 40MHz, 156 Mbps), OAIBOX MAX (MIMO, 100MHz, 800 Mbps), and OAIBOX Open RAN (O-RAN compatible). Includes a cloud-based dashboard for real-time monitoring and control of gNB and 5G Core. Comes with a complete 10-lab manual covering 5G NR bandwidth, TDD/FDD, MCS, MIMO, RACH, LDPC, and 5G security. Supports Split F1 CU/DU and Split 7.2 DU/RU for Open RAN experiments.',
      '5G Education, O-RAN, MIMO, OpenAirInterface, Lab',
      JSON.stringify({
        "OAIBOX 40": "SDR NI B200, SISO, 40MHz BW, 156 Mbps",
        "OAIBOX MAX": "External USRP, MIMO, 100MHz BW, 800 Mbps",
        "OAIBOX Open RAN": "O-RAN compliant, Split 7.2, xApps",
        "Dashboard": "Cloud-based real-time gNB + CN5G monitoring",
        "Lab Manual": "10 laboratory exercises",
        "5G Standard": "3GPP 5G NR SA",
        "Interfaces": "Split F1 (CU/DU), Split 7.2 (DU/RU)",
        "Air Interface": "Over-the-air experiments",
        "Compatible": "NI USRP B200/B210",
        "Target": "University R&D, Telecom Labs"
      }),
      9,
      'green',
    ],
    [
      '5G Private Network',
      '5g',
      "Thailand's first open-source 5G Core — validated with Nokia gNB, cloud-native deployment.",
      "Trinergy's 5G Private Network solution is built on Open5GS, Thailand's first commercially validated open-source 5G Core Network. Tested with Nokia commercial gNB hardware at TOT 5G Test Base (December 2025), achieving 940 Mb/s throughput with 0% packet loss. All 10 Network Functions (AMF, SMF, UPF, PCF, NRF, SCP, UDM, AUSF, BSF, NSSF) are fully operational. Cloud-native architecture with Docker/Kubernetes orchestration and Prometheus/Grafana monitoring. Supported by a national research grant from บพข. (THB 11.67M), targeting TRL 4 → TRL 8.",
      'Enterprise, Open Source, Open5GS, Nokia, Cloud-Native',
      JSON.stringify({
        "Core Stack": "Open5GS (open-source 5G SA)",
        "RAN Hardware": "Nokia gNB (Commercial)",
        "Test Location": "TOT 5G Test Base (Dec 2025)",
        "Throughput": "940 Mb/s",
        "Packet Loss": "0%",
        "Latency": "<10ms edge",
        "Protocol": "NGAP + NAS (5G SA)",
        "Network Functions": "AMF, SMF, UPF, PCF, NRF, SCP, UDM, AUSF, BSF, NSSF",
        "Orchestration": "Docker / Kubernetes",
        "Monitoring": "Prometheus + Grafana",
        "Simulator": "UERANSIM (gNB + UE)",
        "TRL": "4 → 8 (funded by บพข.)"
      }),
      10,
      'green',
    ],
    [
      'FTTX Training Kit',
      'telecom',
      'Fiber optics FTTX training system with OTDR, PON simulation, and 3+ lab exercises.',
      'The FTTX Training Kit is a comprehensive fiber optics training system that simulates high-speed FTTX data communication over optical fiber. Includes PLC splitters, Mechanical Splice, Fusion Splice, Macro Bending simulation, SC adapters, and dummy fiber for realistic PON network experiments. Works with OTDR (Single-mode) and Optical Power Meter to measure signal attenuation. Covers 8+ network event scenarios and comes with structured lab worksheets including OTDR parameter collection, event analysis, and PON link characterization.',
      'Fiber Optics, FTTX, OTDR, PON, Training',
      JSON.stringify({
        "Network Type": "FTTX / PON (Passive Optical Network)",
        "Splitter": "PLC Splitter (min 3 cascadeable)",
        "Splice Types": "Mechanical Splice, Fusion Splice",
        "Test Events": "8+ simulation scenarios",
        "Connector": "SC Adapter",
        "Test Equipment": "OTDR (Single-mode), Optical Power Meter",
        "Wavelength": "1550 nm",
        "Distance Range": "400m – 1.6km (OTDR)",
        "Lab Manual": "3+ structured lab exercises",
        "Target": "University Telecom / Electrical Engineering"
      }),
      11,
      'orange',
    ],
    [
      'PLC Wiring Training Panel',
      'telecom',
      'Portable PLC wiring and testing panel in aluminum case — 16 DI/DO, HMI, motors, relay.',
      'The PLC Wiring & Testing Panel is a portable industrial automation training kit housed in a protective aluminum carry case. Designed for hands-on PLC programming training complying with IEC standards. Supports up to 16 digital inputs and 16 digital outputs in SINK (NPN) or SOURCE (PNP) configuration. Includes 3-phase 24VDC relay wiring, DC motor with belt drive, DIN rail terminals, selector switches, emergency stop, pilot lamps, BCD numerical display, limit switches, and an HMI screen. Comes with 10+ lab exercises and program examples.',
      'PLC, Wiring, Industrial, HMI, Training, IEC',
      JSON.stringify({
        "Housing": "Aluminum carry case (portable)",
        "PLC I/O": "16 Digital Input + 16 Digital Output",
        "I/O Config": "Sink (NPN) / Source (PNP) selectable",
        "Power": "1-phase 220VAC → 24VDC, max 5A",
        "HMI": "Touch screen HMI included",
        "Motor": "24VDC motor with belt drive",
        "Relays": "3x 24VDC relay with wiring",
        "Switches": "4x Pushbutton, 2x Selector, 1x Emergency Stop",
        "Display": "2-digit BCD 7-segment",
        "Limit Switches": "4x Mechanical Limit Switch",
        "Lab Exercises": "10+ exercises with example programs",
        "Standard": "IEC compliant"
      }),
      12,
      'orange',
    ],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertProduct.run(...item);
    }
  });
  insertMany(products);
  console.log('Seeded 12 products with rich descriptions and specs');

  // Seed company info
  const infoCount = db.prepare('SELECT COUNT(*) as count FROM company_info').get();
  if (infoCount.count === 0) {
    const insertInfo = db.prepare(`
      INSERT OR REPLACE INTO company_info (key, value) VALUES (?, ?)
    `);

    const info = [
      ['company_name', 'Trinergy Comm-THA Co., Ltd.'],
      ['founded_year', '2019'],
      ['tagline', 'Engineering Intelligent Infrastructure for the Digital Future'],
      ['phone', '+66 2645 4588'],
      ['phone_sales_ext', '#143–144'],
      ['phone_support_ext', '#220–223'],
      ['phone_service_ext', '#261–263'],
      ['email', 'info@trinergy.co.th'],
      ['line_id', '@trinergycomm'],
      ['website', 'www.trinergy.co.th'],
      ['about_text', 'Trinergy Comm-THA Co., Ltd. was founded in 2019 with a mission to engineer intelligent telecommunications infrastructure for Thailand and the region. We specialize in Private 5G networks, IoT platforms, AI solutions, fiber optics, and RF engineering. Our technology pillars — 5G, IoT, AI, Fiber, and RF — form the foundation of next-generation digital infrastructure. We are proud to be the team behind Thailand\'s first open-source 5G core network, validated with Nokia gNB hardware at the TOT 5G Test Base, achieving 940 Mb/s throughput with 0% packet loss.'],
      ['address', '123 Digital Hub, Bangkok, Thailand'],
      ['values', 'TRUST · TEAMWORK · TECHNOLOGY'],
      ['technology_pillars', '5G · IoT · AI · Fiber · RF'],
    ];

    const insertInfoMany = db.transaction((items) => {
      for (const item of items) {
        insertInfo.run(...item);
      }
    });
    insertInfoMany(info);
    console.log('Seeded company info');
  }

  // Seed 5G specs
  const specsCount = db.prepare('SELECT COUNT(*) as count FROM fiveg_specs').get();
  if (specsCount.count === 0) {
    const insertSpec = db.prepare(`
      INSERT INTO fiveg_specs (spec_key, spec_value, spec_group, display_order)
      VALUES (?, ?, ?, ?)
    `);

    const specs = [
      ['Core Stack', 'Open5GS', 'infrastructure', 1],
      ['RAN Hardware', 'Nokia gNB', 'infrastructure', 2],
      ['Test Location', 'TOT 5G Test Base', 'infrastructure', 3],
      ['Throughput', '940 Mb/s', 'performance', 4],
      ['Packet Loss', '0%', 'performance', 5],
      ['Protocol', 'NGAP + NAS (SA)', 'performance', 6],
      ['Orchestration', 'Docker / Kubernetes', 'deployment', 7],
      ['Monitoring', 'Prometheus + Grafana', 'deployment', 8],
      ['Simulator', 'UERANSIM', 'deployment', 9],
      ['Network Functions', 'AMF, SMF, UPF, PCF, NRF, SCP, UDM, AUSF, BSF, NSSF (ALL UP)', 'nf', 10],
    ];

    const insertSpecMany = db.transaction((items) => {
      for (const item of items) {
        insertSpec.run(...item);
      }
    });
    insertSpecMany(specs);
    console.log('Seeded 5G specs');
  }

  console.log('Database initialized successfully');
}

initDb();

import pyshark
from influxdb_client import InfluxDBClient, Point, WritePrecision
from datetime import datetime

# InfluxDB Configuration
INFLUXDB_URL = "http://localhost:8086"
INFLUXDB_TOKEN = "BIHjWlWlv-iQu4QAWmcTmsRzrweXfY0sZwomJplobJ40B5Azg7FC1nJSlEK1lYdljV-A32KOTDignxD09_VcLQ=="  # Updated Token
INFLUXDB_ORG = "SIUE"
INFLUXDB_BUCKET = "SharkTank"

# Initialize InfluxDB Client
client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)
write_api = client.write_api()

# Function to Write Data to InfluxDB
def write_to_influxdb(src_ip, dst_ip, packet_size):
    point = Point("network_traffic") \
        .tag("src_ip", src_ip) \
        .tag("dst_ip", dst_ip) \
        .field("value", packet_size) \
        .time(datetime.utcnow(), WritePrecision.NS)
    
    try:
        write_api.write(bucket=INFLUXDB_BUCKET, org=INFLUXDB_ORG, record=point)
        print(f"✅ Data successfully pushed to InfluxDB: {src_ip} → {dst_ip}, Size: {packet_size}")
    except Exception as e:
        print(f"❌ Failed to push data: {e}")

# Capture Network Data from File
try:
    capture = pyshark.FileCapture('capture.pcap')

    # Data Extraction Logic
    for packet in capture:
        if 'IP' in packet:
            src_ip = packet.ip.src
            dst_ip = packet.ip.dst
            packet_size = int(packet.length) if hasattr(packet, 'length') else 0

            # Write data point to InfluxDB
            write_to_influxdb(src_ip, dst_ip, packet_size)

except Exception as e:
    print(f"❌ Error processing packets: {e}")

finally:
    capture.close()

print("🚀 Script finished executing. Check Grafana for visualization.")


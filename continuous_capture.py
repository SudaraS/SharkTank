from influxdb_client import InfluxDBClient, Point, WritePrecision
from time import time_ns  # Updated for improved timestamp handling
import pyshark

# InfluxDB Configuration
INFLUXDB_URL = "http://localhost:8086"
INFLUXDB_TOKEN = "BIHjWlWlv-iQu4QAWmcTmsRzrweXfY0sZwomJplobJ40B5Azg7FC1nJSlEK1lYdljV-A32KOTDignxD09_VcLQ=="
INFLUXDB_ORG = "SIUE"
INFLUXDB_BUCKET = "SharkTank"

# Initialize InfluxDB client
client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)
write_api = client.write_api()

# Continuously capture network packets
def capture_packets():
    try:
        capture = pyshark.LiveCapture(interface='en0')  # 'en0' is for Mac Wi-Fi
        print("Capturing packets... Press Ctrl+C to stop.")

        for packet in capture:
            if 'IP' in packet:
                src_ip = packet.ip.src
                dst_ip = packet.ip.dst
                packet_size = int(packet.length)

                point = Point("network_traffic") \
                    .tag("src_ip", src_ip) \
                    .tag("dst_ip", dst_ip) \
                    .field("value", packet_size) \
                    .time(time_ns(), WritePrecision.NS)

                write_api.write(bucket=INFLUXDB_BUCKET, record=point)
                print(f"📊 Data Point Created: {src_ip} -> {dst_ip} | Size: {packet_size}")
    except KeyboardInterrupt:
        print("\n🚨 Packet capture stopped.")
    except Exception as e:
        print(f"⚠️ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    capture_packets()


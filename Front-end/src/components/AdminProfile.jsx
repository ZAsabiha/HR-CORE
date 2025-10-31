
import React, { useState } from "react";

const AdminProfile = () => {
    const [profileData] = useState({
        name: "Mrittika Jahan",
        title: "System Administrator",
        email: "mrittikajahan@company.com",
        phone: "+1 (555) 123-4567",
        department: "IT Administration",
        employeeId: "EMP-2024-001",
        joinDate: "January 15, 2020",
        location: "New York, NY",
        accessLevel: "Super Administrator"
    });

    const [stats] = useState([
        { number: "1,247", label: "Users Managed" },
        { number: "98.5%", label: "System Uptime" },
        { number: "24", label: "Active Projects" },
        { number: "156", label: "Tickets Resolved" }
    ]);

    const [skills] = useState([
        "System Administration", "Network Security", "Linux/Unix", "Cloud Computing",
        "Database Management", "Python", "DevOps", "Cybersecurity", "Project Management", "Team Leadership"
    ]);

    const [activities] = useState([
        {
            title: "System Maintenance Completed",
            time: "2 hours ago",
            description: "Successfully completed scheduled maintenance on production servers."
        },
        {
            title: "New User Accounts Created",
            time: "1 day ago",
            description: "Created 15 new user accounts for marketing department."
        },
        {
            title: "Security Audit Completed",
            time: "3 days ago",
            description: "Resolved 3 minor vulnerabilities found in audit."
        },
        {
            title: "Database Backup Verified",
            time: "5 days ago",
            description: "Verified all database backups are intact and secure."
        }
    ]);

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            padding: '40px 0',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Arial, sans-serif',
            minHeight: '100vh'
        },
        content: {
            maxWidth: '950px', // increased width
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '14px',
            padding: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        },
        header: {
            textAlign: 'center',
            marginBottom: '32px'
        },
        avatar: {
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#276f82',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#fff',
            margin: '0 auto 16px'
        },
        name: {
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '6px'
        },
        title: {
            fontSize: '18px',
            color: '#7f8c8d'
        },
        stats: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '18px',
            justifyContent: 'center',
            marginTop: '28px',
            marginBottom: '22px'
        },
        statCard: {
            flex: '1 1 120px',
            backgroundColor: '#f1f5f9',
            borderRadius: '10px',
            padding: '18px 12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        },
        statNumber: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#276f82',
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#7f8c8d'
        },
        sectionTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2c3e50',
            margin: '28px 0 14px'
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #ecf0f1'
        },
        infoLabel: {
            color: '#7f8c8d',
            fontWeight: '600',
            fontSize: '16px'
        },
        infoValue: {
            color: '#2c3e50',
            fontSize: '16px'
        },
        skillsContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
        },
        skillTag: {
            background: '#276f82',
            color: '#fff',
            borderRadius: '16px',
            padding: '7px 16px',
            fontSize: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
        },
        activityItem: {
            background: '#f9fafb',
            borderLeft: '4px solid #276f82',
            padding: '14px',
            borderRadius: '9px',
            marginBottom: '14px'
        },
        activityTitle: {
            fontWeight: '500',
            color: '#2c3e50',
            fontSize: '15px'
        },
        activityTime: {
            fontSize: '13px',
            color: '#7f8c8d'
        },
        activityDesc: {
            marginTop: '6px',
            color: '#4b5563',
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <div style={styles.avatar}>
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={styles.name}>{profileData.name}</div>
                    <div style={styles.title}>{profileData.title}</div>
                </div>

                {/* Stats */}
                <div style={styles.stats}>
                    {stats.map((stat, i) => (
                        <div key={i} style={styles.statCard}>
                            <div style={styles.statNumber}>{stat.number}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Personal Info */}
                <div style={styles.sectionTitle}>Personal Information</div>
                <div>
                    <div style={styles.infoRow}><span style={styles.infoLabel}>Email</span><span style={styles.infoValue}>{profileData.email}</span></div>
                    <div style={styles.infoRow}><span style={styles.infoLabel}>Phone</span><span style={styles.infoValue}>{profileData.phone}</span></div>
                    <div style={styles.infoRow}><span style={styles.infoLabel}>Department</span><span style={styles.infoValue}>{profileData.department}</span></div>
                    <div style={styles.infoRow}><span style={styles.infoLabel}>Employee ID</span><span style={styles.infoValue}>{profileData.employeeId}</span></div>
                    <div style={styles.infoRow}><span style={styles.infoLabel}>Join Date</span><span style={styles.infoValue}>{profileData.joinDate}</span></div>
                    <div style={styles.infoRow}><span style={styles.infoLabel}>Location</span><span style={styles.infoValue}>{profileData.location}</span></div>
                    <div style={styles.infoRow}><span style={styles.infoLabel}>Access Level</span><span style={styles.infoValue}>{profileData.accessLevel}</span></div>
                </div>

                {/* Skills */}
                <div style={styles.sectionTitle}>Skills & Expertise</div>
                <div style={styles.skillsContainer}>
                    {skills.map((skill, i) => (
                        <div key={i} style={styles.skillTag}>{skill}</div>
                    ))}
                </div>

                {/* Activity */}
                <div style={styles.sectionTitle}>Recent Activity</div>
                <div>
                    {activities.map((activity, i) => (
                        <div key={i} style={styles.activityItem}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={styles.activityTitle}>{activity.title}</div>
                                <div style={styles.activityTime}>{activity.time}</div>
                            </div>
                            <div style={styles.activityDesc}>{activity.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;

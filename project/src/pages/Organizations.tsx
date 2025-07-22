import React, { useState, useEffect } from "react";
import { organizationAPI, userAPI } from "../services/api";
import { Organization, User } from "../types";
import CreateOrganizationModal from "../components/CreateOrganizationModal";
import {
  BuildingOfficeIcon,
  PlusIcon,
  UsersIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Organizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState<number>(0);
  const storedUser = sessionStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  useEffect(() => {
    fetchOrganizations();
    fetchUsers();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const orgsData = await organizationAPI.getAllOrganizations();
      console.log("orgsData", orgsData);
      const approvedOrgs = (orgsData || []).filter((org) => {
        if (currentUser?.role === "admin") {
          return true;
        } else {
          return org.is_approved === 1;
        }
      });

      console.log("Approved Organizations:", approvedOrgs);
      setOrganizations(approvedOrgs);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await userAPI.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedOrg || !assignUserId) return;

    try {
      await organizationAPI.assignUserToOrganization({
        userId: assignUserId,
        organizationId: selectedOrg.id,
      });
      setShowAssignModal(false);
      setSelectedOrg(null);
      setAssignUserId(0);
      fetchOrganizations();
      fetchUsers();
    } catch (error) {
      console.error("Error assigning user:", error);
      alert("Failed to assign user to organization");
    }
  };

  const getUnassignedUsers = () => {
    return users.filter(
      (user) => !user.organization_id && user.role !== "customer"
    );
  };

  const getUsersInOrganization = (orgId: number) => {
    return users.filter((user) => user.organization_id === orgId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleApproveOrganization = async (orgId: number) => {
    try {
      await organizationAPI.isApprove(orgId);
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error("Error approving organization:", error);
      alert("Failed to approve organization");
    }
  };
  console.log("Organizations:", organizations);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage organizations and their members
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Organization</span>
        </button>
      </div>

      {/* Organizations Grid */}
      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No organizations
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first organization.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Organization
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => {
            const members = getUsersInOrganization(org.id);
            return (
              <div
                key={org.id}
                className={`card hover:shadow-lg transition-shadow ${
                  org.is_approved === 0
                    ? "border border-yellow-400 bg-yellow-50"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <BuildingOfficeIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {org.name}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {org.id}</p>
                    </div>
                  </div>

                  {currentUser?.role === "admin" &&
                    (org.is_approved === 1 ? (
                      <button
                        onClick={() => {
                          setSelectedOrg(org);
                          setShowAssignModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Assign User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproveOrganization(org.id)}
                        className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                      >
                        Approve
                      </button>
                    ))}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {org.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="truncate">{org.address}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>{org.phone}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span className="truncate">{org.email}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>
                      Est. {new Date(org.established_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Members */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      <span>Members ({org.members?.length})</span>
                    </div>
                  </div>

                  {org.members?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No members assigned
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {members.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-900">{member.name}</span>
                          <span
                            className={`status-badge text-xs ${
                              member.role === "doctor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                      ))}
                      {members.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{members.length - 3} more members
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Organization Modal */}
      {showCreateModal && (
        <CreateOrganizationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchOrganizations}
        />
      )}

      {/* Assign User Modal */}
      {showAssignModal && selectedOrg && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowAssignModal(false)}
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Assign User to {selectedOrg.name}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="user"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select User
                    </label>
                    <select
                      id="user"
                      value={assignUserId}
                      onChange={(e) =>
                        setAssignUserId(parseInt(e.target.value))
                      }
                      className="input-field"
                    >
                      <option value="">Choose a user</option>
                      {getUnassignedUsers().map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role}) - {user.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {getUnassignedUsers().length === 0 && (
                    <p className="text-sm text-gray-500">
                      No unassigned professionals available.
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignUser}
                    disabled={!assignUserId}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organizations;

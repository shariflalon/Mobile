angular.module('jobmanager.config', [])
.constant('dbConfig', {
    name: 'jobmanager',
    tables: [
        {
            name: 'companies',
            columns: [
                { name: 'id', type: 'integer primary key' },
                { name: 'company_ref', type: 'text' },
                { name: 'name', type: 'text' }
            ]
        },
      	{
      	    name: 'company_engineers',
      	    columns: [
                { name: 'id', type: 'integer primary key' },
                { name: 'company_id', type: 'integer' },
                { name: 'engineer_ref', type: 'text' },
                { name: 'display_name', type: 'text' },
                { name: 'job_title', type: 'text' },
                { name: 'engineer_phone', type: 'text' },
                { name: 'engineer_email', type: 'text' },
                { name: 'password', type: 'text' }
            ]
      	},
        {
            name: 'company_orders',
            columns: [
                { name: 'id', type: 'integer primary key' },
                { name: 'company_id', type: 'integer' },
                { name: 'order_ref', type: 'integer' },
                { name: 'order_name', type: 'text' },
                { name: 'finance_code', type: 'text' },
                { name: 'job_type', type: 'text' },
                { name: 'engineer_id', type: 'integer' },
                { name: 'name', type: 'text' },
                { name: 'customer_id', type: 'integer' },
                { name: 'customer_name', type: 'text' },
                { name: 'onsite_contact', type: 'text' },
                { name: 'address1', type: 'text' },
                { name: 'address2', type: 'text' },
                { name: 'address3', type: 'text' },
                { name: 'address4', type: 'text' },
                { name: 'post_code', type: 'text' },
                { name: 'order_on', type: 'text' },
                { name: 'order_by', type: 'text' },
                { name: 'job_due_date', type: 'text' },
                { name: 'job_started', type: 'integer' },
                { name: 'job_started_on', type: 'text' },
                { name: 'job_started_by', type: 'text' },
                { name: 'signature_data', type: 'text' },
                { name: 'signature_check', type: 'integer' },
                { name: 'health_and_safety_check', type: 'integer' },
                { name: 'before_pics_check', type: 'integer' },
                { name: 'after_pics_check', type: 'integer' },
                { name: 'ppe_check', type: 'integer' },
                { name: 'procedures_followed_check', type: 'integer' },
                { name: 'job_rating', type: 'text' },
                { name: 'customers_comments', type: 'text' },
                { name: 'engineers_notes', type: 'text' },
                { name: 'hvac_notes', type: 'text' },
                { name: 'office_notes', type: 'text' },
                { name: 'job_completed', type: 'integer' },
                { name: 'job_completed_on', type: 'text' },
                { name: 'job_completed_by', type: 'text' },
                { name: 'job_details', type: 'text' }
            ]
        }
    ]
});
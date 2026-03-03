function sortTasks(tasks) {
    return tasks.sort((a, b) => {
        if (b.priority !== a.priority)
            return b.priority - a.priority;
        return new Date(a.deadline) - new Date(b.deadline);
    });
}

function parseSkills(value) {
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : String(value).split(',').map(s => s.trim());
    } catch {
        return String(value).split(',').map(s => s.trim());
    }
}

function canHandle(resource, task) {
    const resourceSkills = parseSkills(resource.skills);
    const requiredSkills = parseSkills(task.required_skills);

    const hasSkills = requiredSkills.every(skill =>
        resourceSkills.includes(skill)
    );

    const hasCapacity = resource.available_capacity >= task.minimum_capacity_needed;

    return hasSkills && hasCapacity;
}

function getBestResource(candidates) {
    return candidates.reduce((best, current) =>
        current.available_capacity > best.available_capacity ? current : best
    );
}

function allocate(resources, tasks) {
    const allocations = [];
    const unallocated = [];

    const sortedTasks = sortTasks(tasks);

    for (const task of sortedTasks) {
        const candidates = resources.filter(r => canHandle(r, task));

        if (candidates.length === 0) {
            unallocated.push({ task: task.name, reason: 'No capable resource available' });
            continue;
        }

        const best = getBestResource(candidates);
        best.available_capacity -= task.estimated_effort;

        allocations.push({
            task_id: task.id,
            task_name: task.name,
            resource_id: best.id,
            resource_name: best.name,
        });
    }

    return { allocations, unallocated };
}

function calculateMetrics(resources) {
    const total = resources.reduce((sum, r) => sum + r.total_capacity, 0);
    const used = resources.reduce(
        (sum, r) => sum + (r.total_capacity - r.available_capacity), 0
    );

    return {
        total_capacity: total,
        used_capacity: used,
        utilization_percentage: total > 0 ? ((used / total) * 100).toFixed(2) + '%' : '0.00%'
    };
}

module.exports = { allocate, calculateMetrics };